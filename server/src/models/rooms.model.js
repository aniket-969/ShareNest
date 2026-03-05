import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Poll } from "./poll.model.js";
import { Expense } from "./expense.model.js";
import { TaskSchema } from "./taskSchema.js";

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
    tasks: [TaskSchema],
    polls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vote" }],
    currency: {
      type: String,
      default: "INR",
      match: /^[A-Z]{3}$/,
    },
    plan: {
      planId: {
        type: String,
        enum: ["free", "pro_monthly", "pro_yearly"],
        required: true,
      },
      region: {
        type: String,
        enum: ["IN", "USD"],
        required: true,
      },
    },
    subscription: {
      provider: {
        type: String,
        enum: ["razorpay"],
      },

      billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
      },

      billingCurrency: {
        type: String,
        enum: ["INR", "USD"],
      },

      razorpaySubscriptionId: {
        type: String,
      },

      razorpayPlanId: {
        type: String,
      },

      status: {
        type: String,
        enum: ["created", "active", "cancelled", "expired"],
      },

      startedAt: {
        type: Date,
      },

      expiresAt: {
        type: Date,
      },
    },
    payment: {
      expiresAt: {
        type: Date,
      },
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
