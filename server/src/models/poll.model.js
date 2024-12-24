import mongoose, { Schema } from "mongoose";

const pollSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voteEndTime: {
      type: String,
      required: true,
    },
    options: [ 
      {
        optionText: {
          type: String,
          required: true,
        },
        votes: [
          {
            voter: {
              type: Schema.Types.ObjectId,
              ref: "User",
            },
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "closed"],
      default: "active",
    },

    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  { timestamps: true }
);

pollSchema.index({ _id: 1, "votes.voter": 1 }, { unique: true });

export const Poll = mongoose.model("Vote", pollSchema);
