import { z } from "zod";
import { objectIdValidation, stringValidation,optionalStringValidation } from "./customValidator.js";

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
    appName: optionalStringValidation(1, 100, "App name"),
    paymentId: optionalStringValidation(1, 100, "Payment ID"),
    type:optionalStringValidation(1,50,"Payment Type"),
    qrCodeData: optionalStringValidation(1, 100, "QrCodeData"),
  })
  .refine(
    (data) => data.paymentId || data.qrCodeData,
    {
      message: "Either paymentId or qrCode is required",
      path: ["paymentId"],
    }
  );
