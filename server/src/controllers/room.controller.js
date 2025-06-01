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
import { mongoose } from 'mongoose';

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
      if (role === "landlord") {
        if (room.landlord) {
          throw new ApiError(400, "Room already has a landlord");
        }
        room.landlord = userId;
      } else if (role === "tenant") {
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
 
const getRoomData = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user?._id;

  console.log("getting room Data");

  // Fetch room with/without pendingRequests based on admin status
  let roomQuery = Room.findById(roomId).select("-groupCode");

  // Check if user is admin (without making an extra DB call)
  const isAdmin = await Room.exists({ _id: roomId, admin: userId });

  if (!isAdmin) {
    roomQuery = roomQuery.select("-pendingRequests"); // Exclude pendingRequests for non-admins
  }

  const room = await roomQuery.populate([
    { path: "admin", select: "username fullName avatar _id" },
    { path: "tenants", select: "username fullName avatar _id" },
    { path: "landlord", select: "username fullName avatar _id" },
    { path: "awards" },
    { path: "tasks.currentAssignee", select: "username fullName" },
    ,
    {
      path: "tasks.participants",
      select: "username fullName avatar _id",
    },
    {
      path: "tasks.rotationOrder",
      select: "username fullName avatar _id",
    },
    { path: "polls" },
    ...(isAdmin ? [{ path: "pendingRequests.userId" }] : []), // Only populate pendingRequests if admin
  ]);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  return res.json(new ApiResponse(200, room, "Room data fetched successfully"));
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

    const user = req.user

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
 
export const kickUser = asyncHandler(async (req, res) => {
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
};
