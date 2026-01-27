import mongoose, { Schema } from "mongoose";

export const TaskSchema = new Schema(
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
        days: [{ type: Number, min: 0, max: 6 }],
        weekday: { type: Number, min: 0, max: 6 },
        ordinal: {
          type: String,
          enum: ["first", "second", "third", "fourth", "last"],
        },
        day: {
          type: Schema.Types.Mixed,
          validate: {
            validator(value) {
              if (typeof value === "number") return value >= 1 && value <= 31;
              if (typeof value === "string") return value === "last";
              return false;
            },
            message: "day must be a number (1–31) or 'last'",
          },
        },
      },
    },

   swapRequests: [
  {
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
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
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
  { timestamps: true }
);
