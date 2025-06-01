import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from "../models/rooms.model.js";
import { ApiError } from "../utils/ApiError.js";

const checkMember = asyncHandler(async (req, res, next) => {
  console.log("Check member",req.params)
  const roomId = req.body?.roomId || req.params?.roomId;
  if (!roomId || roomId ==="undefined") {
    throw new ApiError(404, "Room Id is required");
  }
  // console.log("verifying room",roomId);
  const createdBy = req.user?._id;
  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, "Room not found");

  const isMember =
    room.tenants?.includes(createdBy) ||
    room.landlord?.toString() === createdBy.toString();

  if (!isMember) throw new ApiError(403, "Unauthorized member");
console.log(isMember,"member")
  next();
});

const adminOnly = asyncHandler(async (req, res, next) => {
  const roomId = req.body?.roomId || req.params?.roomId;
  if (!roomId) {
    throw new ApiError(404, "Room Id is required");
  }
  console.log("verifying admin");
  const createdBy = req.user?._id;
  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, "Room not found");

  const isAdmin = room.admin.toString() === createdBy.toString();

  if (!isAdmin) throw new ApiError(403, "Only admin can send this request");

  next();
});

const isRoomMember = async (roomId, userId) => {
  console.log(roomId)
  const room = await Room.findById(roomId).select("tenants admin landlord");

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Check if user is the admin, landlord, or a tenant
  const isMember =
    room.landlord?.toString() === userId.toString() ||
    room.tenants.some((tenantId) => tenantId.toString() === userId.toString());

  return isMember;
};

export { checkMember,adminOnly,isRoomMember };
