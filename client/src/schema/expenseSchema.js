import { z } from "zod";
import {
  stringValidation,
  objectIdValidation,
  optionalStringValidation,
} from "./../utils/validation";

const additionalChargeSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Additional charge must be a positive number")
    .max(1000000, "Amount can't exceed 6 digits"), 
  reason: z.string().min(1, "Reason is required").max(200, "Reason too long"),
});

const participantSchema = z.object({
  userId: objectIdValidation,
  additionalCharges: z.array(additionalChargeSchema).optional(),
});

export const createExpenseSchema = z.object({
  title: stringValidation(1, 50, "title"),
  totalAmount: z.coerce
    .number()
    .positive("Total amount must be a positive number")
    .min(1, "Minimum amount is 1")
    .max(1000000, "Maximum amount allowed is ten lakh"),
  imageUrl: optionalStringValidation(5, 300, "imageUrl"),
  participants: z
    .array(participantSchema)
    .min(1, { message: "Minimum one participants is required" }),
  dueDate: z.coerce.date().optional(),
});

export const updatePaymentSchema = z.object({
  paymentMode: stringValidation(1, 20, "Payment mode").optional(),
});

export const updateExpenseSchema = z.object({
  name: z.string().optional(),
  totalAmount: z.number().positive().optional(),
  paidBy: z.string().optional(),
  imageUrl: z.string().url().optional(),
  participants: z
    .array(
      z.object({
        user: z.string(),
        hasPaid: z.boolean().optional(),
        paidDate: z.date().optional(),
        amountOwed: z.number().positive(),
      })
    )
    .optional(),
  dueDate: z.date().optional(),
  paymentHistory: z
    .array(
      z.object({
        user: z.string(),
        amount: z.number().positive(),
        paymentDate: z.date(),
        description: z.string().optional(),
      })
    )
    .optional(),
});
