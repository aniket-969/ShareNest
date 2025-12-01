import { Expense } from "../models/expense.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ExpenseEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";
import { fcm } from "./../firebase/config.js";
import { User } from "../models/user.model.js";
import { mongoose } from "mongoose";
import { Room } from "../models/rooms.model.js";

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

const getExpenses = asyncHandler(async (req, res) => {
  const roomId = req.query.roomId || req.params.roomId;
  if (!roomId) throw new ApiError(400, "roomId is required");

  const userId = req.user._id.toString();
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
  const beforeId = req.query.beforeId || null;
  const q = (req.query.q || "").trim();

  const match = {
    roomId: new mongoose.Types.ObjectId(roomId),
    isDeleted: { $ne: true },
  };

  // Cursor
  if (beforeId) {
    if (!mongoose.Types.ObjectId.isValid(beforeId)) {
      throw new ApiError(400, "invalid beforeId");
    }

    const beforeDoc = await Expense.findById(beforeId).select("createdAt").lean();
    if (!beforeDoc || !beforeDoc.createdAt) {
      return res.json(
        new ApiResponse(
          200,
          { expenses: [], meta: { hasMore: false, nextBeforeId: null, limit, returned: 0 } },
          "Expenses fetched"
        )
      );
    }

    const beforeCreated = new Date(beforeDoc.createdAt);

    match.$or = [
      { createdAt: { $lt: beforeCreated } },
      { createdAt: beforeCreated, _id: { $lt: mongoose.Types.ObjectId(beforeId) } },
    ];
  }

  // Search 
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    match.$or = match.$or || [];
    match.$or.push(
      { title: re },
      { "paidBy.fullName": re },
      { "participants.fullName": re }
    );
  }

  
  const projection = {
    title: 1,
    paidBy: 1,
    roomId: 1,
    totalAmount: 1,
    currency: 1,
    participants: {
      $slice: ["$participants", 5] 
    },
    createdAt: 1,
    updatedAt: 1,
    isDeleted: 1,
  };


  const docs = await Expense.find(match, {
    "participants.id": 1,
    "participants.fullName": 1,
    "participants.avatar": 1,
    "participants.totalAmountOwed": 1,
    "participants.hasPaid": 1,
    title: 1,
    paidBy: 1,
    roomId: 1,
    totalAmount: 1,
    currency: 1,
    createdAt: 1,
    updatedAt: 1,
    isDeleted: 1,
  })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = docs.length > limit;
  const page = hasMore ? docs.slice(0, limit) : docs;

  const expenses = page.map((exp) => {
    const participants = exp.participants || [];

    const participantAvatars = participants
      .map((p) => p.avatar)
      .filter(Boolean)

    const paidCount = participants.filter((p) => p.hasPaid).length;
    const unpaidCount = participants.length - paidCount;

    const userP = participants.find((p) => p.id && String(p.id) === userId);
    const isUserParticipant = Boolean(userP);
    const hasUserPaid = userP ? Boolean(userP.hasPaid) : false;
    const requesterTotal = userP ? userP.totalAmountOwed : null;

    return {
      ...exp,
      requesterTotal,
      participantAvatars,
      paidCount,
      unpaidCount,
      isUserParticipant,
      hasUserPaid,
    };
  });

  const nextBeforeId = hasMore ? docs[limit]._id.toString() : null;

  return res.json(
    new ApiResponse(
      200,
      { expenses, meta: { hasMore, nextBeforeId, limit, returned: expenses.length } },
      "Expenses fetched successfully"
    )
  );
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId, roomId } = req.params;
  const userId = req.user._id.toString();

  const expense = await Expense.findById(expenseId);
  if (!expense || expense.isDeleted) {
    throw new ApiError(404, "Expense not found");
  }

  if (String(expense.paidBy.id) !== userId) {
    throw new ApiError(403, "You are not allowed to delete this expense");
  }

  const updated = await Expense.findByIdAndUpdate(
    expenseId,
    { isDeleted: true },
    { new: true }
  );

  emitSocketEvent(
    req,
    roomId,
    ExpenseEventEnum.EXPENSE_DELETED_EVENT,
    expenseId
  );

  return res.json(
    new ApiResponse(200, {}, "Expense deleted successfully")
  );
});

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

const getSettleUpDrawer = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const currentUserId = req.user._id;

 const room = req.room
  const coll = mongoose.connection.collection("expenses");

  const pipeline = [
    { $match: { roomId: ObjectId(roomId), isDeleted: { $ne: true } } },

    {
      $facet: {
        owedToYou: [
          { $unwind: "$participants" },
          {
            $match: {
              "paidBy.id": ObjectId(currentUserId),
              "participants.id": { $ne: ObjectId(currentUserId) },
            },
          },
          {
            $group: {
              _id: "$participants.id",
              amount: { $sum: "$participants.totalAmountOwed" },
              lastActivityAt: { $max: "$updatedAt" },
              firstFullName: { $first: "$participants.fullName" },
              firstUsername: { $first: "$participants.username" },
              firstAvatar: { $first: "$participants.avatar" },
            },
          },
          {
            $project: {
              _id: 0,
              participantId: "$_id",
              amount: 1,
              lastActivityAt: 1,
              user: {
                id: "$_id",
                fullName: "$firstFullName",
                username: "$firstUsername",
                avatar: "$firstAvatar",
              },
            },
          },
          { $sort: { amount: -1 } },
        ],

        // People the current user owes
        youOwed: [
          { $unwind: "$participants" },
          {
            $match: {
              "participants.id": ObjectId(currentUserId),
              "paidBy.id": { $ne: ObjectId(currentUserId) },
            },
          },
          {
            $group: {
              _id: "$paidBy.id",
              amount: { $sum: "$participants.totalAmountOwed" },
              lastActivityAt: { $max: "$updatedAt" },
              firstFullName: { $first: "$paidBy.fullName" },
              firstUsername: { $first: "$paidBy.username" },
              firstAvatar: { $first: "$paidBy.avatar" },
            },
          },
          {
            $project: {
              _id: 0,
              participantId: "$_id",
              amount: 1,
              lastActivityAt: 1,
              user: {
                id: "$_id",
                fullName: "$firstFullName",
                username: "$firstUsername",
                avatar: "$firstAvatar",
              },
            },
          },
          { $sort: { amount: -1 } },
        ],

        currency: [{ $limit: 1 }, { $project: { currency: "$currency" } }],
      },
    },
  ];

  const aggResult = await coll.aggregate(pipeline).toArray();
  const result = aggResult[0] || {};

  const owedToYou = result.owedToYou || [];
  const youOwed = result.youOwed || [];

  const totalOwedToMe = owedToYou.reduce((s, r) => s + (r.amount || 0), 0);
  const totalOwe = youOwed.reduce((s, r) => s + (r.amount || 0), 0);

  const currency =
    room.currency ||
    (result.currency && result.currency[0] && result.currency[0].currency) ||
    "INR";

  const payload = {
    roomId,
    currency,
    youOwed,
    owedToYou,
    totalOwedToMe,
    totalOwe,
  };

  return res.json(
    new ApiResponse(200, payload, "settle-up drawer data fetched successfully")
  );
});

const updatePayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { expenseId, roomId } = req.params;
  const { paymentMode, description } = req.body;
  
  const expense = await Expense.findOne({
    _id: expenseId,
    "participants.id": userId,
  }).lean();

  if (!expense) {
    throw new ApiError(404, "Expense not found or you’re not a participant");
  }

  const alreadyPaidInHistory = (expense.paymentHistory || []).some((ph) =>
    ph.user.equals(userId)
  );
  if (alreadyPaidInHistory) {
    throw new ApiError(400, "You have already paid for this expense");
  }

  const participant = (expense.participants || []).find((p) =>
    p.id.equals(userId)
  );
  if (!participant) {
    throw new ApiError(404, "Participant not found in expense");
  }

  if (participant.hasPaid) {
    throw new ApiError(400, "You have already paid for this expense");
  }

  const paymentAmount = participant.totalAmountOwed;

  const now = new Date();
  const updatedExpense = await Expense.findOneAndUpdate(
    {
      _id: expenseId,
      "participants.id": userId,
      "paymentHistory.user": { $ne: userId },
      "participants.hasPaid": { $ne: true },
    },
    {
      $push: {
        paymentHistory: {
          user: userId,
          amount: paymentAmount,
          paymentDate: now,
          paymentMode: paymentMode || null,
          description: description || "",
        },
      },
      $set: {
        "participants.$[p].hasPaid": true,
        "participants.$[p].paidAt": now,
        "participants.$[p].paymentMode": paymentMode || null,
      },
    },
    {
      new: true,
      runValidators: true,
      arrayFilters: [{ "p.id": userId }],
    }
  ).lean();

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
  const { name, totalAmount, paidBy, participants, paymentHistory } = req.body;

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
  getSettleUpDrawer,
  deleteExpense,
  getExpenseDetails,
  updateExpense,
};
