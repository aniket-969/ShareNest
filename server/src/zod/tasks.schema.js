import { objectIdValidation, stringValidation } from "./customValidator.js";
import { z } from "zod";

const completionHistorySchema = z.object({
  date: z.coerce.date(),
  completedBy: objectIdValidation,
  status: z.enum(["completed", "skipped", "reassigned"]),
  notes: z.string().optional(),
});

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
  patterns: z.array(recurrencePatternSchema).optional(),
});

const baseTaskValidation = {
  title: stringValidation(1, 40, "title"),
  description: stringValidation(1, 100, "description").optional(),
  assignmentMode: z.enum(["single", "rotation"]).default("single"),
  participants: z.array(objectIdValidation),
  recurring: recurringSchema,
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
};

// Full task schema including all fields
export const taskSchema = z
  .object({
    _id: objectIdValidation.optional(),
    ...baseTaskValidation,
    lastCompletedDate: z.coerce.date().optional(),
    nextDueDate: z.coerce.date().optional(),
  })
  .superRefine((data, ctx) => {
    // 🔄 Recurrence validation if enabled
    if (data.recurring.enabled) {
      const { type, patterns } = data.recurring;

      // ✅ patterns must exist when type is specified
      if (type && (!patterns || patterns.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "patterns are required when recurring is enabled with a type",
          path: ["recurring", "patterns"],
        });
      }

      // 🔄 Loop through each recurrence pattern for advanced validation
      patterns?.forEach((pattern, index) => {
        const { frequency, dayOfWeek, days, weekOfMonth } = pattern;

        // 🚫 dayOfWeek + days not allowed
        if (dayOfWeek && days?.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "'dayOfWeek' cannot be used with 'days' in the same recurrence pattern.",
            path: ["recurring", "patterns", index, "dayOfWeek"],
          });
        }

        // 🚫 dayOfWeek + weekOfMonth (with multiple days)
        if (
          dayOfWeek &&
          weekOfMonth &&
          Array.isArray(dayOfWeek) &&
          dayOfWeek.length > 1
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "'weekOfMonth' cannot be combined with multiple 'dayOfWeek' values.",
            path: ["recurring", "patterns", index, "weekOfMonth"],
          });
        }

        // 🚫 weekOfMonth without monthly frequency
        if (weekOfMonth && frequency !== "monthly") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "'weekOfMonth' can only be used with 'monthly' frequency.",
            path: ["recurring", "patterns", index, "weekOfMonth"],
          });
        }

        // 🚫 days + weekOfMonth not allowed
        if (days?.length && weekOfMonth) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "'days' and 'weekOfMonth' cannot be used together.",
            path: ["recurring", "patterns", index, "days"],
          });
        }
      });
    }
    if (data.startDate && data.dueDate && data.startDate > data.dueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "dueDate must be after or equal to startDate",
        path: ["dueDate"],
      });
    }
  });

export const createRoomTaskSchema = z.object(baseTaskValidation);

export const updateRoomTaskSchema = z.object(baseTaskValidation).partial();
