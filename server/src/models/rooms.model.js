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
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignmentMode: {
      type: String,
      enum: ["single", "rotation"],
      required: true,
    },

    // Rotation order (authoritative)
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    recurrence: {
      enabled: {
        type: Boolean,
        default: false,
      },

      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        required: true,
      },

      interval: {
        type: Number,
        min: 1,
        default: 1,
      },

      startDate: {
        type: Date,
        required: true,
      },

      selector: {
        type: {
          type: String,
          enum: ["none", "weekdays", "ordinalWeekday", "monthDay"],
          required: true,
        },

        // Weekly selector (0 = Sun, 6 = Sat)
        days: [
          {
            type: Number,
            min: 0,
            max: 6,
          },
        ],

        // Monthly ordinal selector
        weekday: {
          type: Number,
          min: 0,
          max: 6,
        },

        ordinal: {
          type: String,
          enum: ["first", "second", "third", "fourth", "last"],
        },

        // Monthly day selector
        day: {
          type: Schema.Types.Mixed,
          validate: {
            validator: function (value) {
              if (typeof value === "number") {
                return value >= 1 && value <= 31;
              }
              if (typeof value === "string") {
                return value === "last";
              }
              return false;
            },
            message: "day must be a number (1–31) or 'last'",
          },
        },
      },
    },

    swapRequests: [
      {
        occurrenceDate: {
          type: Date,
          required: true,
        },

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

        swapType: {
          type: String,
          enum: ["temporary", "permanent"],
          required: true,
        },

        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
  },
];
,
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
