import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Expense } from "./expense.model.js";
import { CalendarEvent } from "./calendarEvents.model.js";
import { Poll } from "./poll.model.js";

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
        id: {
          type: Schema.Types.ObjectId,
          default: new mongoose.Types.ObjectId(),
        },
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
    maintenanceRequests: [
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
        status: {
          type: String,
          enum: ["pending", "in_progress", "resolved", "cancelled"],
          default: "pending",
        },
        maintenanceProvider: {
          type: String,
        },
        contactPhone: {
          type: String,
        },
        costEstimate: {
          type: Number,
        },
        dateReported: {
          type: Date,
          default: Date.now,
        },
        dateResolved: {
          type: Date,
        },
      },
    ],
    tasks: [
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
        currentAssignee: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: function () {
            return this.assignmentMode === "single";
          }, // Only required if it's a direct assignment
        },
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        dueDate: {
          type: Date,
        },
        participants: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        ],
        rotationOrder: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],

        assignmentMode: {
          type: String,
          enum: ["single", "rotation"],
          default: "single",
          required: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "low",
        },
        switches: [
          {
            requestedBy: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            requestedTo: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
          },
        ],
        switchCountPerUser: [
          {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            requestCount: { type: Number, default: 0 },
            acceptCount: { type: Number, default: 0 },
          },
        ],
        recurring: {
          type: Boolean,
          default: false,
        },
        recurrencePattern: {
          type: String,
          enum: ["daily", "weekly", "monthly", "custom"],
        },
        recurrenceDays: [Number],
        customRecurrence: {
          type: Number,
        },
      },
    ],

    lastMessage: { type: Schema.Types.ObjectId, ref: "ChatMessage" },
    polls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vote" }],
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
      await CalendarEvent.deleteMany({ room: roomId }).session(session);
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
roomSchema.index({ "maintenanceRequests.status": 1 });
roomSchema.index({ "maintenanceRequests.dateReported": 1 });
roomSchema.index({ "maintenanceRequests.dateResolved": 1 });

export const Room = mongoose.model("Room", roomSchema);
