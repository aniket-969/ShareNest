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
    { fullName: 1, avatar: 1, username: 1, notificationToken: 1 }
  ).lean();

  const userMap = {};
  users.forEach((u) => (userMap[String(u._id)] = u));

  const missing = participantIds.filter((id) => !userMap[id]);
  if (missing.length) {
    throw new ApiError(
      400,
      `Some participants not found: ${missing.join(", ")}`
    );
  }

  const baseAmount = Number(totalAmount) / participantIds.length;

  const formattedParticipants = participantIds.map((userId) => {
    const incoming =
      participants.find((p) => String(p.userId) === userId) || {};
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
      username: userSnapshot.username,
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
      username: creator.username,
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
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const beforeId = req.query.beforeId || null;
  const q = (req.query.q || "").trim();

  const match = {
    roomId: new mongoose.Types.ObjectId(roomId),
    isDeleted: { $ne: true },
  };

  if (beforeId) {
    if (!mongoose.Types.ObjectId.isValid(beforeId)) {
      throw new ApiError(400, "invalid beforeId");
    }

    const beforeDoc = await Expense.findById(beforeId)
      .select("createdAt")
      .lean();

    if (!beforeDoc || !beforeDoc.createdAt) {
      return res.json(
        new ApiResponse(
          200,
          {
            expenses: [],
            meta: { hasMore: false, nextBeforeId: null, limit, returned: 0 },
          },
          "Expenses fetched"
        )
      );
    }

    const beforeCreated = new Date(beforeDoc.createdAt);

    match.$or = [
      { createdAt: { $lt: beforeCreated } },
      {
        createdAt: beforeCreated,
        _id: { $lt: new mongoose.Types.ObjectId(beforeId) },
      },
    ];
  }

  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    match.$or = match.$or || [];
    match.$or.push(
      { title: re },
      { "paidBy.fullName": re },
      { "participants.fullName": re }
    );
  }

  const docs = await Expense.find(match, {
    "participants.id": 1,
    "participants.fullName": 1,
    "participants.username": 1,
    "participants.avatar": 1,
    "participants.totalAmountOwed": 1,
    "participants.hasPaid": 1,
    "participants.paidAt": 1,
    "participants.additionalCharges": 1,
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
      .filter((p) => p.avatar)
      .map((p) => ({
        _id: p._id ? String(p._id) : null,
        fullName: p.fullName || "",
        avatar: p.avatar,
      }));

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
      {
        expenses,
        meta: { hasMore, nextBeforeId, limit, returned: expenses.length },
      },
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

  return res.json(new ApiResponse(200, {}, "Expense deleted successfully"));
});

const getSettleUpDrawer = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const ObjectId = mongoose.Types.ObjectId;

  if (!roomId || !ObjectId.isValid(roomId)) {
    throw new ApiError(400, "Invalid roomId");
  }

  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");

  const currentUserId = req.user?._id;
  if (!currentUserId || !ObjectId.isValid(String(currentUserId))) {
    throw new ApiError(401, "Invalid user");
  }

  const isMember = room.tenants.map(String).includes(String(currentUserId));
  if (!isMember) throw new ApiError(403, "Unauthorized member");

  const roomObjId = new ObjectId(roomId);
  const currentUserObjId = new ObjectId(String(currentUserId));

  const coll = Expense.collection;

  const pipeline = [
    { $match: { roomId: roomObjId, isDeleted: { $ne: true } } },

    { $unwind: "$participants" },

    {
      $project: {
        paidBy: 1,
        participants: 1,
        updatedAt: 1,
        currency: 1,
      },
    },

    {
      $facet: {
        theyOweYou: [
          {
            $match: {
              "paidBy.id": currentUserObjId,
              "participants.id": { $ne: currentUserObjId },
              "participants.hasPaid": false,
            },
          },
          {
            $group: {
              _id: "$participants.id",
              amount: { $sum: "$participants.totalAmountOwed" },
              lastActivityAt: { $max: "$updatedAt" },
              fullName: { $first: "$participants.fullName" },
              username: { $first: "$participants.username" },
              avatar: { $first: "$participants.avatar" },
            },
          },
        ],

        youOweThem: [
          {
            $match: {
              "participants.id": currentUserObjId,
              "paidBy.id": { $ne: currentUserObjId },
              "participants.hasPaid": false,
            },
          },
          {
            $group: {
              _id: "$paidBy.id",
              amount: { $sum: "$participants.totalAmountOwed" },
              lastActivityAt: { $max: "$updatedAt" },
              fullName: { $first: "$paidBy.fullName" },
              username: { $first: "$paidBy.username" },
              avatar: { $first: "$paidBy.avatar" },
            },
          },
        ],

        currency: [{ $limit: 1 }, { $project: { currency: 1 } }],
      },
    },
  ];

  const agg = await coll.aggregate(pipeline).toArray();
  const result = agg[0] || {};

  const theyOwe = result.theyOweYou || [];
  const youOwe = result.youOweThem || [];

  const map = new Map();

  for (const row of theyOwe) {
    const id = String(row._id);
    map.set(id, {
      participantId: id,
      user: {
        id,
        fullName: row.fullName,
        username: row.username,
        avatar: row.avatar,
      },
      netAmount: (map.get(id)?.netAmount || 0) + Number(row.amount || 0),
      lastActivityAt: row.lastActivityAt,
    });
  }

  for (const row of youOwe) {
    const id = String(row._id);
    const prev = map.get(id);

    map.set(id, {
      participantId: id,
      user: {
        id,
        fullName: row.fullName,
        username: row.username,
        avatar: row.avatar,
      },
      netAmount: (prev?.netAmount || 0) - Number(row.amount || 0),
      lastActivityAt: prev?.lastActivityAt || row.lastActivityAt,
    });
  }

  const balances = Array.from(map.values()).filter((b) => b.netAmount !== 0);

  const owedToYou = balances
    .filter((b) => b.netAmount > 0)
    .map((b) => ({
      participantId: b.participantId,
      amount: Number(b.netAmount.toFixed(2)),
      lastActivityAt: b.lastActivityAt,
      user: b.user,
    }));

  const youOwed = balances
    .filter((b) => b.netAmount < 0)
    .map((b) => ({
      participantId: b.participantId,
      amount: Number(Math.abs(b.netAmount).toFixed(2)),
      lastActivityAt: b.lastActivityAt,
      user: b.user,
    }));

  const totalOwedToMe = Number(
    owedToYou.reduce((s, r) => s + r.amount, 0).toFixed(2)
  );

  const totalOwe = Number(youOwed.reduce((s, r) => s + r.amount, 0).toFixed(2));

  const currency = room.currency || result.currency?.[0]?.currency || "INR";

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
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const { expenseId, roomId } = req.params;
  const { paymentMode = null } = req.body;

  const expense = await Expense.findOne({
    _id: expenseId,
    "participants.id": userIdObj,
  }).lean();

  if (!expense) {
    throw new ApiError(404, "Expense not found or you’re not a participant");
  }

  const participant = (expense.participants || []).find(
    (p) => String(p.id) === String(userId)
  );

  if (!participant) {
    throw new ApiError(404, "Participant not found in expense");
  }

  if (participant.hasPaid) {
    throw new ApiError(400, "You have already paid for this expense");
  }

  const now = new Date();

  const updatedExpense = await Expense.findOneAndUpdate(
    {
      _id: expenseId,
      "participants.id": userIdObj,
      "participants.hasPaid": false,
    },
    {
      $set: {
        "participants.$[p].hasPaid": true,
        "participants.$[p].paidAt": now,
        "participants.$[p].paymentMode": paymentMode,
      },
      $push: {
        paymentHistory: {
          user: userIdObj,
          amount: participant.totalAmountOwed,
          paymentDate: now,
          paymentMode: paymentMode,
        },
      },
    },
    {
      new: true,
      runValidators: true,
      arrayFilters: [{ "p.id": userIdObj }],
    }
  ).lean();

  if (!updatedExpense) {
    throw new ApiError(400, "You have already paid for this expense");
  }

  emitSocketEvent(req, roomId, ExpenseEventEnum.EXPENSE_UPDATED_EVENT, {
    expenseId,
    updaterId: String(userId),
    paidAt: now,
  });

  return res.json(
    new ApiResponse(200, updatedExpense, "Payment recorded successfully")
  );
});

const updateExpense = asyncHandler(async (req, res) => {
  const { expenseId, roomId } = req.params;
  const userId = String(req.user._id);
  const { title } = req.body;

  if (title === undefined) {
    throw new ApiError(400, "Only 'title' can be updated");
  }

  const expense = await Expense.findById(expenseId);
  if (!expense || expense.isDeleted) {
    throw new ApiError(404, "Expense not found");
  }

  if (String(expense.paidBy?.id) !== userId) {
    throw new ApiError(403, "You are not allowed to update this expense");
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    expenseId,
    { $set: { title: String(title).trim() } },
    { new: true, runValidators: true }
  ).lean();

  emitSocketEvent(req, roomId, ExpenseEventEnum.EXPENSE_UPDATED_EVENT, {
    expenseId,
    title: updatedExpense.title,
  });

  return res.json(
    new ApiResponse(200, updatedExpense, "Expense updated successfully")
  );
});

const settleAllWithUser = asyncHandler(async (req, res) => {
  const { roomId, owedToUserId } = req.params;
  const userId = req.user?._id;
  const paymentMode = req.body.paymentMode || null;
  const { owedToUserName } = req.body;

  if (!roomId || !mongoose.Types.ObjectId.isValid(roomId))
    throw new ApiError(400, "Invalid roomId");

  if (!owedToUserId || !mongoose.Types.ObjectId.isValid(owedToUserId))
    throw new ApiError(400, "Invalid owedToUserId");

  if (!userId || !mongoose.Types.ObjectId.isValid(String(userId)))
    throw new ApiError(401, "Invalid user");

  const room = await Room.findById(roomId).lean();
  if (!room) throw new ApiError(404, "Room not found");

  const isMember = (room.tenants || []).map(String).includes(String(userId));
  if (!isMember) throw new ApiError(403, "Unauthorized member");

  const userObjId = new mongoose.Types.ObjectId(String(userId));
  const creditorObjId = new mongoose.Types.ObjectId(String(owedToUserId));
  const roomObjId = new mongoose.Types.ObjectId(String(roomId));

  if (String(userObjId) === String(creditorObjId))
    throw new ApiError(400, "Cannot settle with yourself");

  const now = new Date();
  const currency = room.currency || "INR";

  const youOwe = await Expense.find(
    {
      roomId: roomObjId,
      currency,
      isDeleted: { $ne: true },
      "paidBy.id": creditorObjId,
      participants: { $elemMatch: { id: userObjId, hasPaid: { $ne: true } } },
    },
    { _id: 1, participants: 1 }
  ).lean();

  const theyOwe = await Expense.find(
    {
      roomId: roomObjId,
      currency,
      isDeleted: { $ne: true },
      "paidBy.id": userObjId,
      participants: {
        $elemMatch: { id: creditorObjId, hasPaid: { $ne: true } },
      },
    },
    { _id: 1, participants: 1 }
  ).lean();

  if (youOwe.length === 0 && theyOwe.length === 0) {
    return res.json(
      new ApiResponse(
        200,
        {
          settledCount: 0,
          currency,
        },
        "Nothing to settle"
      )
    );
  }

  const ops = [];
  let totalAmount = 0;

  const computeAmount = (participant) => {
    const raw = Number(participant.totalAmountOwed || 0);
    return Math.round((raw + Number.EPSILON) * 100) / 100;
  };

  for (const exp of youOwe) {
    const participant = exp.participants.find(
      (p) => String(p.id) === String(userObjId)
    );
    if (!participant) continue;

    const amount = computeAmount(participant);
    totalAmount += amount;

    ops.push({
      updateOne: {
        filter: {
          _id: new mongoose.Types.ObjectId(exp._id),
          participants: {
            $elemMatch: { id: userObjId, hasPaid: { $ne: true } },
          },
        },
        update: {
          $set: {
            "participants.$[p].hasPaid": true,
            "participants.$[p].paidAt": now,
            "participants.$[p].paymentMode": paymentMode,
          },
          $push: {
            paymentHistory: {
              user: userObjId,
              amount,
              paymentDate: now,
              paymentMode,
              description: `Bulk settle (you→them)`,
            },
          },
        },
        arrayFilters: [{ "p.id": userObjId }],
      },
    });
  }

  for (const exp of theyOwe) {
    const participant = exp.participants.find(
      (p) => String(p.id) === String(creditorObjId)
    );
    if (!participant) continue;

    const amount = computeAmount(participant);
    totalAmount += amount;

    ops.push({
      updateOne: {
        filter: {
          _id: new mongoose.Types.ObjectId(exp._id),
          participants: {
            $elemMatch: { id: creditorObjId, hasPaid: { $ne: true } },
          },
        },
        update: {
          $set: {
            "participants.$[p].hasPaid": true,
            "participants.$[p].paidAt": now,
            "participants.$[p].paymentMode": paymentMode,
          },
          $push: {
            paymentHistory: {
              user: creditorObjId,
              amount,
              paymentDate: now,
              paymentMode,
              description: `Bulk settle (them→you)`,
            },
          },
        },
        arrayFilters: [{ "p.id": creditorObjId }],
      },
    });
  }

  await Expense.bulkWrite(ops, { ordered: false });

  const actorName = req.user?.fullName || "Someone";
  const displayName = owedToUserName || "someone";

  emitSocketEvent(req, roomId, "settleAll:completed", {
    message: `${actorName} settled all balances with ${displayName}`,
  });

  return res.json(
    new ApiResponse(
      200,
      {
        settledCount: ops.length,
        totalAmount: Math.round((totalAmount + Number.EPSILON) * 100) / 100,
        currency,
      },
      "Settlement completed"
    )
  );
});

export {
  createExpense,
  updatePayment,
  getSettleUpDrawer,
  deleteExpense,
  updateExpense,
  getExpenses,
  settleAllWithUser,
};
