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
          type: Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        title: {
          type: String,
          required: true,
        },
        description: String,
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
          required: function () {
            return this.assignmentMode === "single";
          },
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
        recurring: {
          enabled: {
            type: Boolean,
            default: false,
          },
          type: {
            type: String,
            enum: ["fixed", "dynamic", "mixed"],
            // fixed: specific days/dates
            // dynamic: every X days
            // mixed: combination of both
          },
          patterns: [
            {
              frequency: {
                type: String,
                enum: ["daily", "weekly", "monthly", "custom"],
              },
              interval: {
                type: Number,
                default: 1, // every X days/weeks/months
              },
              days: [Number], // 0-6 for weekdays, 1-31 for monthdays
              weekOfMonth: {
                type: String,
                enum: ["first", "second", "third", "fourth", "last"],
              },
              dayOfWeek: {
                type: Number, // 0-6 representing Sunday to Saturday
              },
            },
          ],
          startDate: Date,
          endDate: Date,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "skipped"],
          default: "pending",
        },
        completionHistory: [
          {
            date: Date,
            completedBy: {
              type: Schema.Types.ObjectId,
              ref: "User",
            },
            status: {
              type: String,
              enum: ["completed", "skipped", "reassigned"],
            },
            notes: String,
          },
        ],
        lastCompletedDate: Date,
        nextDueDate: Date,
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
