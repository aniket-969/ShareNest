import { z } from "zod";
import {
  stringValidation,
  objectIdValidation,
  optionalStringValidation,
} from "./../utils/validation";

export const createCustomAwardSchema = z.object({
  title: stringValidation(1, 30, "title"),
  description: optionalStringValidation(1, 60, "description"),
  image: stringValidation(1, 300, "image link"),
  criteria: optionalStringValidation(1, 30, "criteria"),
  assignedTo: z
    .array(objectIdValidation)
    .min(1, "Minimum one participants is required")
    .max(20, "Maximum allowed participants are 20"),
});

export const updateAwardSchema = z.object({
  title: stringValidation(1, 20, "title").optional(),
  description: stringValidation(1, 50, "description").optional(),
  image: stringValidation(1, 300, "image").optional(),
  criteria: stringValidation(1, 20, "criteria").optional(),
  assignedTo: objectIdValidation.optional(),
});
