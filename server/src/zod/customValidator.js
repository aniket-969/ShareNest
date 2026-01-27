import {z} from "zod"
import { isValidObjectId } from "mongoose";

export const objectIdValidation = z
  .string()
  .refine((val) => isValidObjectId(val), {
    message: "Invalid objectId format",
  }); 

export const stringValidation = (min, max, fieldName) => {
 return z.string()
    .min(min, {
      message: `${fieldName} must be at least ${min} characters long.`,
    })
    .max(max, {
      message: `${fieldName} must be no more than ${max} characters long.`,
    });
};

export const dateSchema = z
  .string()
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  });

  export const optionalStringValidation = (min, max, fieldName) => {
  return z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val)) 
    .optional()
    .refine((val) => !val || val.length >= min, {
      message: `${fieldName} must be at least ${min} characters long.`,
    })
    .refine((val) => !val || val.length <= max, {
      message: `${fieldName} must be no more than ${max} characters long.`,
    });
};