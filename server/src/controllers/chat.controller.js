import { Room } from "../models/rooms.model.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { emitSocketEvent } from "../socket/index.js";
import { AvailableChatEvents, ChatEventEnum } from "../constants.js";
import mongoose from "mongoose";

const sendMessage = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { content = "" } = req.body;

  const selectedRoom = await Room.findById(roomId).select("_id tenants");
  if (!selectedRoom) {
    throw new ApiError(404, "Room does not exist");
  }

  const senderSnapshot = {
    _id: req.user._id,
    username: req.user.username,
    fullName: req.user.fullName,
    avatar: req.user.avatar,
  };

  const messageDoc = await ChatMessage.create({
    sender: senderSnapshot,
    content: typeof content === "string" ? content.trim() : "",
    room: new mongoose.Types.ObjectId(roomId),
  });

  if (!messageDoc) {
    throw new ApiError(500, "Failed to create message");
  }

  const messageObj = messageDoc.toObject({ getters: true });

 
  const tenants = Array.isArray(selectedRoom.tenants) ? selectedRoom.tenants : [];
  const recipients = new Set(tenants.map((id) => id.toString()));

  for (const participantId of recipients) {
    if (participantId === req.user._id.toString()) continue;
    emitSocketEvent(
      req,
      participantId,
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      messageObj
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, messageObj, "Message saved successfully"));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { roomId, messageId } = req.params;
  console.log(roomId, messageId);
  const chat = await Room.findById(roomId);
  console.log(chat);

  if (!chat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const message = await ChatMessage.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message does not exist");
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not the authorised to delete the message, you are not the sender"
    );
  }

  // if (message.attachments.length > 0) {

  //     message.attachments.forEach((attachment) => {

  //         deleteFileFromCloud(attachment.url);
  //       });
  // }

  await ChatMessage.deleteOne({
    _id: new mongoose.Types.ObjectId(messageId),
  });

  if (chat.lastMessage.toString() === message._id.toString()) {
    const lastMessage = await ChatMessage.findOne(
      { chat: roomId },
      {},
      { sort: { createdAt: -1 } }
    );

    await Room.findByIdAndUpdate(roomId, {
      lastMessage: lastMessage ? lastMessage?._id : null,
    });
  }
  const recipients = [...chat.tenants];
  if (chat.landlord) {
    recipients.push(chat.landlord);
  }

  recipients.forEach((participantId) => {
    if (participantId.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participantId.toString(),
      ChatEventEnum.MESSAGE_DELETE_EVENT,
      message
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message deleted successfully"));
});

const getAllMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 200); 
  const beforeId = req.query.beforeId || null; 

  const selectedRoom = await Room.findById(roomId).select("_id tenants");
  if (!selectedRoom) throw new ApiError(404, "Room does not exist");

  if (!selectedRoom.tenants.some((id) => id.toString() === req.user._id.toString())) {
    throw new ApiError(403, "You are not authorized to view this chat");
  }

 
  const query = { room: roomId };

  if (beforeId) {
  
    const beforeDoc = await ChatMessage.findById(beforeId).select("createdAt").lean();
    if (beforeDoc && beforeDoc.createdAt) {
      query.createdAt = { $lt: new Date(beforeDoc.createdAt) };
    } else {
     
      return res.status(200).json(
        new ApiResponse(200, { messages: [], meta: { hasMore: false, nextBeforeId: null, limit, returnedCount: 0 } }, "Messages fetched")
      );
    }
  }

  
  const docs = await ChatMessage.find(query)
    .sort({ createdAt: -1 })      
    .limit(limit + 1)
    .lean();

  const hasMore = docs.length > limit;
  const pageDocs = docs.slice(0, limit);
  const messages = pageDocs.reverse();   

 
  const nextBeforeId = hasMore ? docs[limit]._id.toString() : null;

  const meta = {
    hasMore,
    nextBeforeId,
    limit,
    returnedCount: messages.length,
  };

  return res.status(200).json(
    new ApiResponse(200, { messages, meta }, "Messages fetched successfully")
  );
});

export { sendMessage, deleteMessage, getAllMessages };
