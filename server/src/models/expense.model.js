import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        baseAmount: { type: Number, required: true },
        additionalCharges: {
          type: [
            {
              amount: { type: Number, required: true },
              reason: { type: String, required: true },
            },
          ],
          default: [],
        },
        totalAmountOwed: { type: Number, required: true },
      },
    ],
    paymentHistory: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        paymentDate: { type: Date, required: true },
        description: {
          type: String,
        },
      },
    ],
    totalAmountPaid: {
      type: Number,
      required: true,
    },
   currency: {
      type: String,
      default: "INR",
      match: /^[A-Z]{3}$/,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ room: 1 });
expenseSchema.index({ "participants.user": 1 });
expenseSchema.index({ dueDate: 1 });
expenseSchema.index({ "participants.hasPaid": 1 });
expenseSchema.index({ "paymentHistory.paymentDate": 1 });
expenseSchema.index({ createdAt: 1 });
expenseSchema.index({ room: 1, "participants.hasPaid": 1 });

export const Expense = mongoose.model("Expense", expenseSchema);
