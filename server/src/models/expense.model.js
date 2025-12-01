import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    paidBy: {
      id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      fullName: { type: String, required: true },
      avatar: { type: String, default: null }
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    participants: [
      {
       
        id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true },
        avatar: { type: String, default: null },

        baseAmount: { type: Number, required: true },
        additionalCharges: [
          {
            amount: { type: Number, required: true },
            reason: { type: String, required: true },
          }
        ],
        totalAmountOwed: { type: Number, required: true },

        hasPaid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
        paymentMode: { type: String, default: null },
      },
    ],

    paymentHistory: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        paymentDate: { type: Date, required: true },
        paymentMode: { type: String, default: null },
        description: { type: String, default: "" }
      },
    ],

    currency: {
      type: String,
      default: "INR",
      match: /^[A-Z]{3}$/
    },

    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

expenseSchema.index({ room: 1 });
expenseSchema.index({ "participants.user": 1 });
expenseSchema.index({ "participants.hasPaid": 1 });
expenseSchema.index({ "paymentHistory.paymentDate": 1 });
expenseSchema.index({ createdAt: 1 });
expenseSchema.index({ room: 1, "participants.hasPaid": 1 });

export const Expense = mongoose.model("Expense", expenseSchema);
