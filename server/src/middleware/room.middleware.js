import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from "../models/rooms.model.js";
import { ApiError } from "../utils/ApiError.js";

const checkMember = asyncHandler(async (req, res, next) => {
  const roomId = req.body?.roomId || req.params?.roomId;

  if (!roomId) {
    throw new ApiError(400, "Room Id is required");
  }

  const userId = req.user._id;

  const room = await Room.findById(roomId).select("tenants currency");
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const isMember = room.tenants.some(
    (tenantId) => tenantId.toString() === userId.toString()
  );

  if (!isMember) {
    throw new ApiError(403, "Unauthorized member");
  }

  req.room = room; 

  next();
});


const adminOnly = asyncHandler(async (req, res, next) => {
  const roomId = req.body?.roomId || req.params?.roomId;
  if (!roomId) {
    throw new ApiError(404, "Room Id is required");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Check admin
  const currentUserId = req.user._id.toString();
  if (room.admin.toString() !== currentUserId) {
    throw new ApiError(403, "Only admin can send this request");
  }

  req.room = room;
  next();
});

const isRoomMember = async (roomId, userId) => {
  console.log(roomId);
  const room = await Room.findById(roomId).select("tenants admin landlord");

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const isMember =
    room.landlord?.toString() === userId.toString() ||
    room.tenants.some((tenantId) => tenantId.toString() === userId.toString());

  return isMember;
};

export { checkMember, adminOnly, isRoomMember };
