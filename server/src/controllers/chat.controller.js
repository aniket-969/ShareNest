import { Room } from "../models/rooms.model.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { emitSocketEvent } from "../socket/index.js";
import { AvailableChatEvents, ChatEventEnum } from "../constants.js";
import mongoose from "mongoose";

const sendMessage = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { roomId } = req.params;
  console.log("roomId", roomId);
  const { content } = req.body;

  const selectedRoom = await Room.findById(roomId);

  if (!selectedRoom) {
    throw new ApiError(404, "Chat does not exist");
  }

  const messageFiles = [];

  if (req.files && req.files.attachments?.length > 0) {
    req.files.attachments?.map((attachment) => {
      messageFiles.push({
        url: attachment.url,
      });
    });
  }

  const message = await ChatMessage.create({
    sender: new mongoose.Types.ObjectId(req.user._id),
    content: content || "",
    chat: new mongoose.Types.ObjectId(roomId),
    attachments: messageFiles,
  });

  const chat = await Room.findByIdAndUpdate(
    roomId,
    {
      $set: {
        lastMessage: message._id,
      },
    },
    { new: true }
  );

  const receivedMessage = await ChatMessage.findById(message._id)
    .populate("sender", "username avatar email")
    .populate("chat", "room participants");

  if (!receivedMessage) {
    throw new ApiError(500, "Internal server error");
  }

  const recipients = [...selectedRoom.tenants];
  if (selectedRoom.landlord) {
    recipients.push(selectedRoom.landlord);
  }

  recipients.forEach((participantId) => {
    if (participantId.toString() === req.user._id.toString()) return;

    emitSocketEvent(
      req,
      participantId.toString(),
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      receivedMessage
    );
  });

  return res
    .status(201)
    .json(new ApiResponse(201, receivedMessage, "Message saved successfully"));
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const selectedRoom = await Room.findById(roomId);

  if (!selectedRoom) {
    throw new ApiError(404, "Room does not exist");
  }

  if (
    !selectedRoom.tenants.includes(req.user._id) &&
    (!selectedRoom.landlord ||
      selectedRoom.landlord.toString() !== req.user._id.toString())
  ) {
    throw new ApiError(403, "You are not authorized to view this chat");
  }

  const messages = await ChatMessage.find({ chat: roomId })
    .sort({ createdAt: -1 }) // Latest messages first
    .skip(skip)
    .limit(limit)
    .populate("sender", "fullName avatar");

  const totalMessages = await ChatMessage.countDocuments({ chat: roomId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages,
        totalPages: Math.ceil(totalMessages / limit),
        currentPage: page,
      },
      "Messages fetched successfully"
    )
  );
});

export { sendMessage, deleteMessage, getAllMessages };
