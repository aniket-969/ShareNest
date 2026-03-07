import { Room } from "../models/rooms.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";
import { Expense } from "../models/expense.model.js";
import { RoomEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";
import { mongoose } from "mongoose";
import { ChatMessage } from "./../models/chatMessage.model.js";
import { ROOM_PLANS, PLAN_FEATURES } from "../config/roomPlans.js";

function generateGroupCode() {
  return crypto.randomBytes(6).toString("hex").slice(0, 6).toUpperCase();
}

async function generateUniqueGroupCode() {
  let isUnique = false;
  let groupCode;

  while (!isUnique) {
    groupCode = generateGroupCode();

    const existingRoom = await Room.findOne({ groupCode });

    if (!existingRoom) {
      isUnique = true;
    }
  }

  return groupCode;
}

const getRoomData = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user?._id;

  console.log("getting room Data");

  let roomQuery = Room.findById(roomId);

  const populateArr = [
    { path: "tenants", select: "username fullName avatar _id paymentMethod" },
    { path: "admin", select: "username fullName avatar _id" },

    // Tasks
    {
      path: "tasks.createdBy",
      select: "username fullName avatar _id",
    },
    {
      path: "tasks.participants",
      select: "username fullName avatar _id",
    },
    {
      path: "tasks.swapRequests.from",
      select: "username fullName avatar _id",
    },
    {
      path: "tasks.swapRequests.to",
      select: "username fullName avatar _id",
    },

    { path: "awards" },
    { path: "polls" },

    { path: "pendingRequests.userId", select: "username fullName avatar _id" },
  ];

  const room = await roomQuery.populate(populateArr);
  if (!room) throw new ApiError(404, "Room not found");
  const isAdmin = room.admin?._id.equals(userId);
  if (!isAdmin) room.pendingRequests = undefined;

  // Fetch latest messages
  const LIMIT = 50;
  const latestPlusOne = await ChatMessage.find({ room: roomId })
    .sort({ createdAt: -1 })
    .limit(LIMIT + 1)
    .populate("sender", "fullName avatar username _id")
    .lean();

  const hasMore = latestPlusOne.length > LIMIT;
  const chatMessages = latestPlusOne.slice(0, LIMIT).reverse();
  const nextBeforeId = hasMore ? latestPlusOne[LIMIT]._id.toString() : null;

  const chatMessagesMeta = {
    hasMore,
    nextBeforeId,
    limit: LIMIT,
    returnedCount: chatMessages.length,
  };

  return res.json(
    new ApiResponse(
      200,
      { room, chatMessages, chatMessagesMeta },
      "Room data + recent messages fetched successfully"
    )
  );
});

const getRoomPricing = asyncHandler(async (req, res) => {
  const country = req.headers["cf-ipcountry"];
  const region = country != "IN" ? "IN" : "USD";

  const regionConfig = ROOM_PLANS[region];

  const plans = Object.values(regionConfig.plans).map((plan) => ({
    planId: plan.planId,
    label: plan.label,
    price: plan.price,
    billingCycle: plan.billingCycle,
    maxMembers: plan.maxMembers,
    period: plan.period,
    features:
      plan.planId === "free"
        ? PLAN_FEATURES.free
        : [
            ...PLAN_FEATURES.pro,
            plan.billingCycle === "yearly"
              ? "Save more with yearly billing"
              : null,
          ].filter(Boolean),
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        country: region,
        currency: regionConfig.currency,
        plans,
      },
      "Pricing details fetched successfully"
    )
  );
});

const getRoomPaymentDetails = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user?._id;

  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Only admin can complete payment
  if (room.admin.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the room admin can complete payment");
  }

  if (room.subscription?.status === "active") {
    throw new ApiError(409, "Room subscription already active");
  }

  if (!room.subscription || room.subscription.status !== "created") {
    throw new ApiError(400, "Room is not in a payable state");
  }

  if (room.payment?.expiresAt && room.payment.expiresAt < new Date()) {
    throw new ApiError(
      410,
      "Payment session expired. Please recreate the room."
    );
  }

  // Resolve plan configuration
  const { planId, region } = room.plan || {};
  const regionConfig = ROOM_PLANS[region];
  const planConfig = regionConfig?.plans?.[planId];

  if (!planConfig || !planConfig.paid) {
    throw new ApiError(400, "Invalid paid plan configuration");
  }

  const paymentDetails = {
    roomId: room._id,
    roomName: room.name,

    planId,
    planLabel: planConfig.label,
    billingCycle: planConfig.billingCycle,

    price: planConfig.price,
    currency: regionConfig.currency,

    expiresAt: room.payment?.expiresAt,

    subscriptionId: room.subscription?.razorpaySubscriptionId || null,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paymentDetails,
        "Room payment details fetched successfully"
      )
    );
});

const createRoom = asyncHandler(async (req, res) => {
  const admin = req.user?._id;
  const { name, description, planId } = req.body;

  const country = req.headers["cf-ipcountry"];
  const region = country === "IN" ? "IN" : "USD";

  const regionConfig = ROOM_PLANS[region];
  const planConfig = regionConfig?.plans?.[planId];

  if (!planConfig) {
    throw new ApiError(400, "Invalid plan selected");
  }

  // Free Plan
  if (!planConfig.paid) {
    const existingFreeRoom = await Room.findOne({
      admin,
      "plan.planId": "free",
    });

    if (existingFreeRoom) {
      throw new ApiError(
        403,
        "Free plan limit reached. Upgrade to create more rooms."
      );
    }
    const pendingRooms = await Room.countDocuments({
      admin,
      "subscription.status": "created",
      "payment.expiresAt": { $gt: new Date() },
    });
    if (pendingRooms >= 2) {
      throw new ApiError(
        403,
        "You already have 2 rooms awaiting payment. Complete one before creating another."
      );
    }
    const groupCode = await generateUniqueGroupCode();

    const room = await Room.create({
      name,
      description,
      admin,
      groupCode,
      plan: {
        planId: "free",
        region,
      },
      tenants: [admin],
    });

    const user = await User.findById(admin);
    if (user) {
      user.rooms.push({ roomId: room._id, name: room.name });
      await user.save();
    }

    return res
      .status(201)
      .json(new ApiResponse(201, room, "Room created successfully"));
  }

  // Paid Plan
  const groupCode = await generateUniqueGroupCode();

  const room = await Room.create({
    name,
    description,
    admin,
    groupCode,
    plan: {
      planId,
      region,
    },
    tenants: [admin],
    subscription: {
      provider: "razorpay",
      billingCycle: planConfig.billingCycle,
      billingCurrency: regionConfig.currency,
      status: "created",
    },
    payment: {
      expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000),
    },
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        roomId: room._id,
        paymentRequired: true,
      },
      "Room created. Payment required to activate."
    )
  );
});

const updateRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { name, description } = req.body;

  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    { $set: { name, description } },
    { new: true, runValidators: true }
  );

  if (!updatedRoom) {
    throw new ApiError(404, "Room not found");
  }
  emitSocketEvent(req, roomId, RoomEventEnum.UPDATE_ROOM_EVENT, `Room updated`);
  return res.json(
    new ApiResponse(200, updatedRoom, "Room updated successfully")
  );
});

const addUserRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { groupCode } = req.body;

  const room = await Room.findOne({ groupCode });
  if (!room) {
    throw new ApiError(404, "Room doesn't exist");
  }

  if (room.admin.toString() === userId.toString()) {
    throw new ApiError(400, "Admin can't send request to their own room");
  }

  if (room.tenants.some((id) => id.toString() === userId.toString())) {
    throw new ApiError(400, "User is already a member of this room");
  }

  if (room.pendingRequests.length >= 50) {
    throw new ApiError(400, "Room has too many pending requests already");
  }

  const alreadyRequested = room.pendingRequests.some(
    (req) => req.userId.toString() === userId.toString()
  );

  if (alreadyRequested) {
    throw new ApiError(400, "Request already sent");
  }

  const role = "tenant";

  room.pendingRequests.push({ userId, role });
  await room.save();

  emitSocketEvent(
    req,
    room.admin.toString(),
    RoomEventEnum.JOIN_ROOM_REQUEST_EVENT,
    {
      userId,
      roomId: room._id,
      role,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Request sent successfully"));
});

const adminResponse = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { requestId, action } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room = await Room.findById(roomId).session(session);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.admin.toString() !== req.user._id.toString()) {
      throw new ApiError(401, "Only admin can respond to requests");
    }

    const requestIndex = room.pendingRequests.findIndex(
      (request) => request.id.toString() === requestId
    );
    if (requestIndex === -1) {
      throw new ApiError(400, "No such pending request");
    }

    const { userId, role } = room.pendingRequests[requestIndex];

    if (action === "approved") {
      if (role === "tenant") {
        room.tenants.push(userId);
      }

      room.pendingRequests.splice(requestIndex, 1);

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      user.rooms.push({ roomId: room._id, name: room.name });

      await user.save({ session });
      await room.save({ session });

      await session.commitTransaction();
      session.endSession();

      emitSocketEvent(req, userId, RoomEventEnum.REQUEST_ROOM_RESPONSE_EVENT, {
        action: "approved",
        roomId: room._id,
        roomName: room.name,
      });

      return res.json(
        new ApiResponse(200, {}, "User approved and added to the room")
      );
    } else {
      room.pendingRequests.splice(requestIndex, 1);
      await room.save({ session });

      await session.commitTransaction();
      session.endSession();

      emitSocketEvent(req, userId, RoomEventEnum.REQUEST_ROOM_RESPONSE_EVENT, {
        action: "denied",
        roomId: room._id,
        roomName: room.name,
      });

      return res.json(
        new ApiResponse(
          200,
          {},
          "User denied and removed from pending requests"
        )
      );
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

const deleteRoom = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;
  const { roomId } = req.params;

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (adminId.toString() !== room.admin.toString()) {
    throw new ApiError(403, "Only admin can delete rooms");
  }

  await room.remove();
  emitSocketEvent(
    req,
    roomId,
    RoomEventEnum.DELETE_ROOM_EVENT,
    `Admin deleted the room 🥺`
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Room and related data deleted successfully")
    );
});

const leaveRoom = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { roomId } = req.params;

  // transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room = await Room.findById(roomId).session(session);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }
    if (room.admin.toString() === userId.toString()) {
      throw new ApiError(400, "Admin can't leave the room");
    }

    //  Remove user from room.tenants
    room.tenants = room.tenants.filter(
      (tenantId) => tenantId.toString() !== userId
    );
    await room.save({ session });

    const user = req.user;

    //  Remove room from user rooms array
    user.rooms = user.rooms.filter(
      (room) => room.roomId.toString() !== roomId.toString()
    );
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    emitSocketEvent(
      req,
      roomId,
      RoomEventEnum.LEAVE_ROOM_EVENT,
      `${user.fullName} left the room 🥺`
    );

    return res.json(new ApiResponse(200, {}, "User has left the room"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

const transferAdminControl = asyncHandler(async (req, res) => {
  const { newAdminId } = req.params;
  const room = req.room;

  // Check for newAdminId is a member
  if (!room.tenants.includes(newAdminId)) {
    throw new ApiError(400, "New admin must be a member of the room");
  }

  room.admin = newAdminId;
  await room.save();

  emitSocketEvent(
    req,
    room._id.toString(),
    RoomEventEnum.ADMIN_ROOM_CHANGE,
    "Room admin changed"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, room, "Admin rights transferred successfully"));
});

const kickUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id.toString();
  const { roomId, targetUserId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room = await Room.findById(roomId).session(session);
    if (!room) throw new ApiError(404, "Room not found");

    if (room.admin.toString() !== adminId) {
      throw new ApiError(403, "Only admin can kick members");
    }

    if (adminId === targetUserId) {
      throw new ApiError(400, "Admin cannot kick themselves");
    }

    const tenantIndex = room.tenants.findIndex(
      (t) => t.toString() === targetUserId
    );
    if (tenantIndex === -1) {
      throw new ApiError(400, "User is not a member of this room");
    }
    room.tenants.splice(tenantIndex, 1);
    await room.save({ session });

    const user = await User.findById(targetUserId).session(session);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.rooms = user.rooms.filter(
      (r) => r.roomId.toString() !== roomId.toString()
    );
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    emitSocketEvent(
      req,
      roomId,
      RoomEventEnum.KICK_MEMBER_EVENT,
      `A member was removed by the admin`
    );

    return res.json(
      new ApiResponse(200, {}, "User has been kicked from the room")
    );
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

export {
  createRoom,
  addUserRequest,
  adminResponse,
  updateRoom,
  deleteRoom,
  getRoomData,
  leaveRoom,
  transferAdminControl,
  kickUser,
  getRoomPricing,
  getRoomPaymentDetails,
};
