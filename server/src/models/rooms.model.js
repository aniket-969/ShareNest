import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Poll } from "./poll.model.js";
import { Expense } from "./expense.model.js";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    groupCode: {
      type: String,
      required: true,
      unique: true,
      length: 6,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    landlord: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tenants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pendingRequests: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["tenant", "landlord"], required: true },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    awards: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        image: {
          type: String,
          required: true,
        },
        criteria: {
          type: String,
        },
        assignedTo: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        ],
      },
    ],
    tasks: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        assignmentMode: {
          type: String,
          enum: ["single", "rotation"],
          default: "single",
        },
        currentAssignee: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        participants: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        rotationOrder: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],

        // Recurrence rules
        recurring: {
          enabled: { type: Boolean, default: false },
          type: {
            type: String,
            enum: ["fixed", "dynamic", "mixed"],
          },
          patterns: [
            {
              frequency: {
                type: String,
                enum: ["daily", "weekly", "monthly", "custom"],
              },
              interval: { type: Number, default: 1 },
              days: [Number],
              weekOfMonth: {
                type: String,
                enum: ["first", "second", "third", "fourth", "last"],
              },
              dayOfWeek: Number,
            },
          ],
          startDate: { type: Date, default: () => Date.now() },
          dueDate: Date,
        },

        // Swap-turn requests for a specific occurrence
        swapRequests: [
          {
            _id: {
              type: Schema.Types.ObjectId,
              default: () => new mongoose.Types.ObjectId(),
            },
            occurrenceDate: { type: Date, required: true },
            from: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            to: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            status: {
              type: String,
              enum: ["pending", "approved", "rejected"],
              default: "pending",
            },
            requestedAt: { type: Date, default: Date.now },
            respondedAt: Date,
            resolver: { type: Schema.Types.ObjectId, ref: "User" },
          },
        ],

        status: {
          type: String,
          enum: ["pending", "completed", "skipped"],
          default: "pending",
        },
      },
    ],
    polls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vote" }],
   currency: {
      type: String,
      default: "INR",
      match: /^[A-Z]{3}$/,
    },
  },

  { timestamps: true }
);

roomSchema.pre(
  "remove",
  { document: true, query: false },
  async function (next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const roomId = this._id;

      await Expense.deleteMany({ room: roomId }).session(session);
      await Poll.deleteMany({ room: roomId }).session(session);

      await session.commitTransaction();
      session.endSession();
      next();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
);

roomSchema.index({ "tasks.dueDate": 1 });
roomSchema.index({ "tasks.currentAssignee": 1 });
roomSchema.index({ "tasks.createdBy": 1 });
roomSchema.index({ "tasks.participants": 1 });
roomSchema.index({ "tasks.recurring": 1, "tasks.recurrencePattern": 1 });


export const Room = mongoose.model("Room", roomSchema);
