import { z } from "zod";
import { objectIdValidation, stringValidation } from "./customValidator.js";

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 8 characters long." })
  .max(64, { message: "Password must not exceed 64 characters." })
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one numerical digit.",
  })
  .refine((value) => /[!@#$%^&*]/.test(value), {
    message: "Password must contain at least one special character.",
  });

export const registerSchema = z.object({
  username: stringValidation(1, 20, "username"),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(200, { message: "Email must be no more than 50 characters long" }),
  fullName: stringValidation(1, 20, "fullName"),
  password: passwordSchema,
  avatar: stringValidation(5, 300, "avatar"),
});

export const loginSchema = z.object({
  identifier: stringValidation(1, 200, "identifier"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const updateUserSchema = z.object({
  username: stringValidation(1, 20, "username").optional(),
  fullName: stringValidation(1, 20, "fullName").optional(),
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .regex(
      /^https:\/\/avatar\.iran\.liara\.run\/public\/\d+$/,
      "Avatar must come from avatar.iran.liara.run"
    )
    .optional(),
});

export const paymentMethodSchema = z
  .object({
    appName: stringValidation(1, 100, "App name is required").optional(),
    paymentId: stringValidation(1, 100, "Payment ID is required").optional(),
    type: z
      .enum([
        "UPI",
        "PayPal",
        "Stripe",
        "BankTransfer",
        "ApplePay",
        "CashApp",
        "WeChatPay",
      ])
      .optional(),
    qrCodeData: z
      .string()
      .min(1, "qrCodeData should be at least 1 character long")
      .optional(),
  })
  .refine((data) => data.paymentId || data.qrCodeData, {
    message: "Either paymentId or qrCodeData is required",
    path: ["paymentId", "qrCodeData"],
  });
