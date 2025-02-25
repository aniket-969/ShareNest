import {
  stringValidation,
  objectIdValidation,
  optionalStringValidation,
} from "@/utils/validation";
import { z } from "zod";

// Enum for days of week to maintain type safety
export const DaysOfWeek = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const recurrencePatternSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly", "custom"]),
  interval: z.coerce.number().int().positive().default(1),
  days: z.array(z.number().min(0).max(31)).optional(),
  weekOfMonth: z
    .enum(["first", "second", "third", "fourth", "last"])
    .optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
});

const recurringSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(["fixed", "dynamic", "mixed"]).optional(),
  patterns: z.array(recurrencePatternSchema).optional(),
});

export const createRoomTaskSchema = z
  .object({
    title: stringValidation(1, 40, "title"),
    description: optionalStringValidation(1, 100, "description"),
    assignmentMode: z.enum(["single", "rotation"]),
    participants: z
      .array(objectIdValidation)
      .min(1, "At least one participant is required")
      .max(20, "Maximum 20 participants allowed"),

    // Recurring task fields
    recurring: recurringSchema,
    startDate: z.date().optional(),
    dueDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate dates
    if (data.startDate && data.dueDate && data.startDate > data.dueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Due date must be after start date",
        path: ["dueDate"],
      });
    }

    // Validate recurring task requirements
    if (data.recurring.enabled) {
      if (!data.recurring.patterns) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Recurrence pattern is required for recurring tasks",
          path: ["pattern"],
        });
        return;
      }

      const pattern = data.recurring.patterns;
      // Validate pattern based on frequency
      switch (pattern.frequency) {
        case "weekly":
          if (!pattern.selectedDays?.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Select at least one day for weekly recurrence",
              path: ["pattern", "selectedDays"],
            });
          }
          break;

        case "monthly":
          if (pattern.monthlyOption === "dayOfMonth" && !pattern.dayOfMonth) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Day of month is required",
              path: ["pattern", "dayOfMonth"],
            });
          } 
          if (
            pattern.monthlyOption === "dayOfWeek" &&
            (!pattern.weekOfMonth || typeof pattern.dayOfWeek !== "number")
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Week of month and day of week are required",
              path: ["pattern", "weekOfMonth"],
            });
          }
          break;

        case "custom":
          if (!pattern.customDays) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Number of days is required for custom recurrence",
              path: ["pattern", "customDays"],
            });
          }
          break;
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
