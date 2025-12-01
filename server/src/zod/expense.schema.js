import { z } from "zod";
import { objectIdValidation, stringValidation } from "./customValidator.js";

const additionalChargeSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Additional charge must be a positive number")
    .max(1000000, "Amount can't exceed 6 digits"),
  reason: stringValidation(1,200,"Reason"),
});

const participantSchema = z.object({
  userId: objectIdValidation,
  additionalCharges: z.array(additionalChargeSchema).optional(),
}); 

const createExpense = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { title, totalAmount, participants = [] } = req.body;
  const creator = req.user;

  const room = await Room.findById(roomId).select("currency tenants");
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = room.tenants.some(
    (id) => String(id) === String(creator._id)
  );
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this room");
  }

  const participantIds = participants.map((p) => String(p.userId));

  const users = await User.find(
    { _id: { $in: participantIds } },
    { fullName: 1, avatar: 1, notificationToken: 1 }
  ).lean();

  const userMap = {};
  users.forEach((u) => (userMap[String(u._id)] = u));

  const missing = participantIds.filter((id) => !userMap[id]);
  if (missing.length) {
    throw new ApiError(400, `Some participants not found: ${missing.join(", ")}`);
  }

  const baseAmount = Number(totalAmount) / participantIds.length;

  const formattedParticipants = participantIds.map((userId) => {
    const incoming = participants.find((p) => String(p.userId) === userId) || {};
    const charges = (incoming.additionalCharges || []).map((c) => ({
      amount: Number(c.amount),
      reason: c.reason,
    }));
    const additionalTotal = charges.reduce((s, c) => s + c.amount, 0);
    const totalAmountOwed = baseAmount + additionalTotal;
    const userSnapshot = userMap[userId];

    return {
      id: userId,
      fullName: userSnapshot.fullName,
      avatar: userSnapshot.avatar || null,
      baseAmount,
      additionalCharges: charges,
      totalAmountOwed,
      hasPaid: false,
      paidAt: null,
      paymentMode: null,
    };
  });

  const creatorPart = formattedParticipants.find(
    (p) => String(p.id) === String(creator._id)
  );
  const now = new Date();
  let initialPaymentHistory = [];

  if (creatorPart) {
    creatorPart.hasPaid = true;
    creatorPart.paidAt = now;
    creatorPart.paymentMode = "SELF";

    initialPaymentHistory.push({
      user: creator._id,
      amount: creatorPart.totalAmountOwed,
      paymentDate: now,
      paymentMode: "SELF",
      description: "Self-paid share",
    });
  }

  const expenseCurrency = room.currency || "INR";

  const expense = await Expense.create({
    title,
    roomId,
    totalAmount: Number(totalAmount),
    paidBy: {
      id: creator._id,
      fullName: creator.fullName,
      avatar: creator.avatar || null,
    },
    participants: formattedParticipants,
    paymentHistory: initialPaymentHistory,
    currency: expenseCurrency,
  });

  emitSocketEvent(req, roomId, ExpenseEventEnum.EXPENSE_CREATED_EVENT, expense);

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense created successfully"));
});

export const updatePaymentSchema = z.object({
  paymentMode: stringValidation(1, 20, "Payment mode").optional(),
});

export const updateExpenseSchema = z.object({
  name: z.string().optional(),
  totalAmount: z.number().positive().optional(),
  paidBy: z.string().optional(),
  participants: z
    .array(
      z.object({
        user: z.string(),
        hasPaid: z.boolean().optional(),
        paidDate: z
          .string()
          .transform((val) => new Date(val))
          .refine((date) => !isNaN(date.getTime()), {
            message: "Invalid date format",
          })
          .optional(),
        amountOwed: z.number().positive(),
      })
    )
    .optional(),
  paymentHistory: z
    .array(
      z.object({
        user: z.string(),
        amount: z.number().positive(),
        paymentDate: z.date(),
        description: z.string().optional(),
      })
    )
    .optional(),
});
