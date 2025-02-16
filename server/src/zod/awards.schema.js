import { z } from "zod";
import { objectIdValidation, stringValidation } from "./customValidator.js";
  
export const createCustomAwardSchema = z.object({
  title: stringValidation(1, 30, "title"),
  description: stringValidation(1, 60, "description").optional(),
  image: stringValidation(1, 300, "image"),
  criteria: stringValidation(1, 30, "criteria").optional(),
  assignedTo: z.array(objectIdValidation) .min(1, "Minimum one participants is required")
  .max(20, "Maximum allowed participants are 20"),
});

export const updateAwardSchema = z.object({
    
    title: stringValidation(1, 30, "title").optional(),
    description: stringValidation(1, 60, "description").optional(),
    image: stringValidation(1, 300, "image").optional(),
    criteria: stringValidation(1, 20, "criteria").optional(),
    assignedTo: objectIdValidation.optional(),
})
