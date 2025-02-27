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

const createRoom = asyncHandler(async (req, res) => {
  const admin = req.user?._id;
  const { name, description, role } = req.body;

  const groupCode = await generateUniqueGroupCode();
  let roomData = {
    name,
    description,
    admin,
    groupCode,
  };

  if (role === "landlord") {
    roomData.landlord = admin;
  } else if (role === "tenant") {
    roomData.tenants = [admin];
  }

  const room = await Room.create(roomData);

  const createdRoom = await Room.findById(room._id);
  if (!createdRoom) {
    throw new ApiError(400, "Error creating room");
  }

  const user = await User.findById(admin);
  if (user) {
    user.rooms.push({ roomId: createdRoom._id, name: createdRoom.name });
    await user.save();
  }

  return res.json(
    new ApiResponse(201, createdRoom, "Room created successfully")
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
  const userId = req.user?._id;
  const { groupCode, role } = req.body;

  const room = await Room.findOne({ groupCode });

  if (!room) {
    throw new ApiError(404, "Room doesn't exist");
  }

  if (room.admin.toString() === userId.toString()) {
    throw new ApiError(400, "Admin can't send request to their own room");
  }

  if (room.pendingRequests.length > 50) {
    throw new ApiError(400, "Room has too many pending requests already");
  }

  if (
    !room.pendingRequests.some(
      (request) => request.userId.toString() === userId.toString()
    )
  ) {
    room.pendingRequests.push({ userId, role });
    await room.save();
  } else {
    return res.json(new ApiResponse(400, {}, "Request already sent"));
  }
  emitSocketEvent(
    req,
    room.admin.toString(),
    RoomEventEnum.JOIN_ROOM_REQUEST_EVENT,
    {
      userId,
      role,
      roomId: room._id,
    }
  );
  return res.json(new ApiResponse(200, {}, "Request sent successfully"));
});

const adminResponse = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { requestId, action } = req.body;

  const room = await Room.findById(roomId);
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
    if (role === "landlord") {
      if (room.landlord) {
        throw new ApiError(400, "Room already has a landlord");
      }
      room.landlord = userId;
    } else if (role === "tenant") {
      room.tenants.push(userId);
    }

    room.pendingRequests.splice(requestIndex, 1);

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.rooms.push({ roomId: room._id, name: room.name });
    await user.save();
    await room.save();

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
    await room.save();

    emitSocketEvent(req, userId, RoomEventEnum.REQUEST_ROOM_RESPONSE_EVENT, {
      action: "denied",
      roomId: room._id,
      roomName: room.name,
    });
    return res.json(
      new ApiResponse(200, {}, "User denied and removed from pending requests")
    );
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

const getRoomData = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user?._id;
  // console.log(roomId, userId);
  console.log("getting room Data");
  let roomQuery = await Room.findById(roomId).select(
    "-groupCode -pendingRequests"
  );

  const room = await roomQuery.populate([
    { path: "admin", select: "username fullName avatar _id" },
    { path: "tenants", select: "username fullName avatar _id" },
    { path: "landlord", select: "username fullName avatar _id" },
    {
      path: "awards",
    },
    {
      path: "tasks.currentAssignee",
      select: "username fullName",
    },
    { path: "polls" },
  ]);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.admin.toString() === userId.toString()) {
    const roomWithRequests = await Room.findById(roomId)
      .select("-groupCode")
      .populate("admin tenants landlord awards pendingRequests.userId");
    return res.json(
      new ApiResponse(200, roomWithRequests, "Room data fetched successfully")
    );
  }

  return res.json(new ApiResponse(200, room, "Room data fetched successfully"));
});

const leaveRoom = asyncHandler(async (req, res) => {
  console.log("This is user", req.user);
  const userId = req.user?._id;
  const { roomId } = req.params;

  const room = await Room.findById(roomId);

  if (room.admin.toString() === userId.toString()) {
    throw new ApiError(400, "Admin can't leave the room");
  }

  room.tenants = room.tenants.filter(
    (tenant) => tenant.toString() !== userId.toString()
  );
  await room.save();
  const user = req.user;
  user.rooms = user.rooms.filter(
    (room) => room.id.toString() !== roomId.toString()
  );
  await user.save();
  emitSocketEvent(
    req,
    roomId,
    RoomEventEnum.LEAVE_ROOM_EVENT,
    `${user.fullName} left the room 🥺`
  );
  return res.json(new ApiResponse(200, {}, "User has left the room"));
});

const transferAdminControl = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { newAdminId } = req.body;
  const currentAdminId = req.user?._id;

  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.admin.toString() !== currentAdminId.toString()) {
    throw new ApiError(403, "Only the current admin can transfer admin rights");
  }

  if (!room.tenants.includes(newAdminId)) {
    throw new ApiError(400, "New admin must be a member of the room");
  }

  room.admin = newAdminId;
  await room.save();
  emitSocketEvent(
    req,
    roomId,
    RoomEventEnum.ADMIN_ROOM_CHANGE,
    `Room admin changed`
  );
  return res
    .status(200)
    .json(new ApiResponse(200, room, "Admin rights transferred successfully"));
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
};
