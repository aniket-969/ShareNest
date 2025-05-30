import { z } from "zod";
import { stringValidation } from "./../utils/validation";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const imageValidation = z
  .instanceof(File)
  .refine(
    (file) => {
      return ALLOWED_IMAGE_TYPES.includes(file.type);
    },
    {
      message: "Invalid file type. Only JPEG and PNG are allowed.",
    }
  )
  .refine(
    (file) => {
      return file.size <= MAX_IMAGE_SIZE;
    },
    {
      message: `File size should be less than ${
        MAX_IMAGE_SIZE / 1024 / 1024
      } MB.`,
    }
  );

const passwordSchema = z
  .string()
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
    .max(50, { message: "Email must be no more than 50 characters long" }),
  fullName: stringValidation(1, 20, "fullName"),
  password: passwordSchema,
  avatar: stringValidation(5, 300, "avatar"),
});

export const loginSchema = z.object({
  identifier: stringValidation(1, 20, "identifier"),
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
      qrCodeData:  stringValidation(1, 100, "qrData is required").optional(),
  })
  .refine((data) => data.paymentId || data.qrData, {
    message: "Either paymentId or qrCode is required",
    path: ["paymentId", "qrCodeData"],
  });
