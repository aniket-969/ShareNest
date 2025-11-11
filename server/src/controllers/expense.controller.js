import { Expense } from "../models/expense.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ExpenseEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";
import { fcm } from "./../firebase/config.js";
import { User } from "../models/user.model.js";
import { mongoose } from "mongoose";

const getUserExpenses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const expenses = await Expense.find({
    "participants.user": userId,
    paidBy: { $ne: userId },
  })
    .populate("paidBy", "fullName avatar")
    .populate("participants.user", "fullName avatar")
    .lean();
  console.log("This is expense", expenses);
  return res.json(
    new ApiResponse(200, expenses, "user expenses fetched successfully")
  );
});

const getPendingPayments = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const pendingExpense = await Expense.find({ paidBy: userId })
    .populate("paidBy", "fullName avatar")
    .populate("participants.user", "fullName avatar");

  if (!pendingExpense.length) {
    return res.json(new ApiResponse(200, [], "No user payment found"));
  }

  return res.json(
    new ApiResponse(
      200,
      pendingExpense,
      " Pending payments owed to user fetched successfully"
    )
  );
});

const createExpense = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { title, totalAmount, dueDate, participants, currency } =
    req.body;
  const paidBy = req.user._id;

  if (!participants?.length) {
    throw new ApiError(400, "At least one participant is required");
  }

  const baseAmount = Math.round(totalAmount / participants.length);
  const formattedParticipants = participants.map(
    ({ userId, additionalCharges }) => {
      const charges = (additionalCharges || []).map(({ amount, reason }) => ({
        amount,
        reason,
      }));
      const additionalTotal = charges.reduce((sum, c) => sum + c.amount, 0);
      return {
        user: userId,
        baseAmount,
        additionalCharges: charges,
        totalAmountOwed: baseAmount + additionalTotal,
      };
    }
  );
  const payerPart = formattedParticipants.find(
    (p) => p.user.toString() === paidBy.toString()
  );
  const payerAmount = payerPart?.totalAmountOwed ?? 0;
  const expense = await Expense.create({
    title,
    paidBy,
    roomId,
    dueDate,
    participants: formattedParticipants,
    totalAmountPaid: 0,
    paymentHistory: [
      {
        user: paidBy,
        amount: payerAmount,
        paymentDate: new Date(),
        description: "Self-paid share",
      },
    ],
    currency: currency || "INR",
  });

  if (!expense) {
    throw new ApiError(500, "Expense creation failed");
  }

  emitSocketEvent(req, roomId, ExpenseEventEnum.EXPENSE_CREATED_EVENT, expense);

  // FCM notification
  try {
    const recipientIds = formattedParticipants.map((p) => p.user);
    const users = await User.find(
      { _id: { $in: recipientIds } },
      "notificationToken"
    ).lean();

    const tokens = users.map((u) => u.notificationToken).filter(Boolean);
    if (tokens.length) {
      const actorName = req.user.fullName || req.user.username || "Someone";
      await fcm.sendToDevice(tokens, {
        notification: {
          title: "New Expense Added",
          body: `${actorName} added "${expense.title}"`,
        },
        data: { expenseId: expense._id.toString() },
      });
    }
  } catch (err) {
    console.error("FCM push error:", err);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense created successfully"));
});

const updatePayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { expenseId, roomId } = req.params;
  const { paymentMode } = req.body;

  const expense = await Expense.findOne({
    _id: expenseId,
    "participants.user": userId,
  });
  if (!expense) {
    throw new ApiError(404, "Expense not found or you’re not a participant");
  }

  const alreadyPaid = expense.paymentHistory.some((ph) =>
    ph.user.equals(userId)
  );
  if (alreadyPaid) {
    throw new ApiError(400, "You have already paid for this expense");
  }

  const participant = expense.participants.find((p) => p.user.equals(userId));
  const paymentAmount = participant.totalAmountOwed;

  const updatedExpense = await Expense.findOneAndUpdate(
    {
      _id: expenseId,
      "participants.user": userId,
      "paymentHistory.user": { $ne: userId },
    },
    {
      $push: {
        paymentHistory: {
          user: userId,
          amount: paymentAmount,
          paymentDate: new Date(),
          description: paymentMode || "",
        },
      },
      $inc: { totalAmountPaid: paymentAmount },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedExpense) {
    throw new ApiError(400, "You have already paid for this expense");
  }

  emitSocketEvent(
    req,
    roomId,
    ExpenseEventEnum.EXPENSE_UPDATED_EVENT,
    updatedExpense
  );

  return res.json(
    new ApiResponse(200, updatedExpense, "Payment recorded successfully")
  );
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId, roomId } = req.params;

  const deletedExpense = await Expense.findByIdAndDelete(expenseId);
  if (!deletedExpense) {
    throw new ApiError(404, "Expense not find");
  }
  const user = req.user;
  emitSocketEvent(
    req,
    roomId,
    ExpenseEventEnum.EXPENSE_DELETED_EVENT,
    expenseId
  );
  return res.json(new ApiResponse(200, {}, "Expense deleted successfully"));
});

const getExpenseDetails = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const expense = await Expense.findById(expenseId)
    .populate("paidBy", "fullName avatar")
    .populate("participants.user", "fullName avatar");

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res.json(
    new ApiResponse(200, expense, "Expense details fetched successfully")
  );
});

const updateExpense = asyncHandler(async (req, res) => {
  const { expenseId, roomId } = req.params;
  const userId = req.user.id;
  const {
    name,
    totalAmount,
    paidBy,
    participants,
    dueDate,
    paymentHistory,
  } = req.body;

  // Fetch the expense to validate ownership
  const expense = await Expense.findById(expenseId);
  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  // Validate if the user is allowed to update the expense
  if (expense.paidBy.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to update this expense");
  }

  // Prepare updates based on provided fields
  const updates = {
    ...(name !== undefined && { name }),
    ...(totalAmount !== undefined && { totalAmount }),
    ...(paidBy !== undefined && { paidBy }),
    ...(participants !== undefined && { participants }),
    ...(dueDate !== undefined && { dueDate }),
    ...(paymentHistory !== undefined && { paymentHistory }),
  };

  // Update the expense document
  const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updates, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are enforced
  });
  const user = req.user;
  emitSocketEvent(
    req,
    roomId,
    ExpenseEventEnum.MAINTENANCE_DELETED_EVENT,
    updatedExpense
  );

  return res.json(
    new ApiResponse(200, updatedExpense, "Expense updated successfully")
  );
});

export {
  createExpense,
  updatePayment,
  getUserExpenses,
  getPendingPayments,
  deleteExpense,
  getExpenseDetails,
  updateExpense,
};
