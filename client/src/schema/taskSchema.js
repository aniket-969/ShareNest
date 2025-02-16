import {
  stringValidation,
  objectIdValidation,
  optionalStringValidation,
} from "@/utils/validation";
import { z } from "zod";

export const createRoomTaskSchema = z
  .object({
    title: stringValidation(1, 20, "title"),
    description: optionalStringValidation(5, 50, "description").optional(),
    assignmentMode: z.enum(["single", "rotation"]),
    dueDate: z.date().optional(),
    startDate: z.date().optional(),
    participants: z
      .array(objectIdValidation)
      .min(1, "Minimum one participants is required")
      .max(20, "Maximum allowed participants are 20"),
    priority: z.enum(["low", "medium", "high"]).optional(),
    recurring: z.boolean().optional(),
    recurrencePattern: optionalStringValidation(1, 20, "recurrence pattern"),
    recurrenceDays: z
  .array(
    z.enum([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ])
  )
  .optional()
,
    customRecurrence:z.coerce.number()
    .max(300, { message: "Maximum allowed value for custom recurrence is 300" })
    .min(1, { message: "Minimum one digit is required" })
    .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recurring) {
      const hasRecurrenceDays =
        data.recurrenceDays && data.recurrenceDays.length > 0;
      const hasRecurrencePattern = !!data.recurrencePattern;
      const hasCustomRecurrence = !!data.customRecurrence;

      if (!hasRecurrenceDays && !hasRecurrencePattern && !hasCustomRecurrence) {
        ctx.addIssue({
          path: ["recurrenceDays"],
          message:
            "At least one of recurrenceDays, recurrencePattern, or customRecurrence must be provided",
        });
      }
    }
  });

export const updateRoomTaskSchema = z.object({
  roomId: objectIdValidation,
  taskId: objectIdValidation,
  title: stringValidation(1, 20, "title").optional(),
  description: stringValidation(5, 50, "description").optional(),
  currentAssignee: objectIdValidation.optional(),
  dueDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  participants: z.array(objectIdValidation).optional(),
  rotationOrder: stringValidation(1, 20, "rotationOrder").optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  recurring: z.boolean().optional(),
  recurrencePattern: stringValidation(1, 20, "recurrence pattern").nullable(),
  customRecurrence: stringValidation(1, 20, "custom recurrence").nullable(),
  startDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
});
