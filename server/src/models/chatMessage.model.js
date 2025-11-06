import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema(
  {
    sender: {
      _id: { type: Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      fullName: { type: String, required: true },
      avatar: { type: String },
    },
    content: {
      type: String,
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  { timestamps: true }
);

chatMessageSchema.index({ room: 1, createdAt: -1 });


export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
