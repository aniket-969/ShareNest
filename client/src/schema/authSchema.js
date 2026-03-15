import { z } from "zod";
import { stringValidation,optionalStringValidation } from "./../utils/validation";

const passwordSchema = z
  .string()
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one numerical digit.",
  })
  .refine((value) => /[!@#$%^&*]/.test(value), {
    message: "Password must contain at least one special character.",
  });
 
export const registerSchema = z.object({
 
  email: z
    .string().trim()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(50, { message: "Email must be no more than 50 characters long" }),
  fullName: stringValidation(1, 20, "fullName"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z
    .string().trim()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(50, { message: "Email must be no more than 50 characters long" }),
  password: passwordSchema,
});


export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,              
    newPassword: passwordSchema,              
    confirmNewPassword: z.string(),        
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
  });

export const updateUserSchema = z.object({
  fullName: optionalStringValidation(1, 20, "fullName"),
  avatar: z
    .string()
    .url("Avatar must be a valid URL").optional(),
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
 
  export const forgotPasswordSchema = z.object({
  email: stringValidation(5, 100, "Email").email("Invalid email address"),
});
 
export const resetPasswordSchema = z
  .object({
    
    password: stringValidation(8, 100, "Password"),
    confirmPassword: stringValidation(8, 100, "Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

