import { objectIdValidation, stringValidation } from "./customValidator.js";
import { z } from "zod";

const completionHistorySchema = z.object({
  date: z.date(),
  completedBy: objectIdValidation,
  status: z.enum(["completed", "skipped", "reassigned"]),
  notes: z.string().optional(),
});

const recurrencePatternSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly", "custom"]),
  interval: z.number().int().positive().default(1),
  days: z.array(z.number().min(0).max(31)).optional(),
  weekOfMonth: z
    .enum(["first", "second", "third", "fourth", "last"])
    .optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
});

const recurringSchema = z.object({
  enabled: z.boolean().default(false),
  type: z.enum(["fixed", "dynamic", "mixed"]).optional(),
  patterns: z.array(recurrencePatternSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const taskSchema = z
  .object({
    _id: objectIdValidation.optional(),
    title: stringValidation(1, 100, "title"),
    description: z.string().optional(),
    createdBy: objectIdValidation,
    assignmentMode: z.enum(["single", "rotation"]).default("single"),
    currentAssignee: objectIdValidation.optional(),
    participants: z.array(objectIdValidation),
    rotationOrder: z.array(objectIdValidation).optional(),
    recurring: recurringSchema,
    status: z.enum(["pending", "completed", "skipped"]).default("pending"),
    completionHistory: z.array(completionHistorySchema).optional(),
    lastCompletedDate: z.date().optional(),
    nextDueDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate currentAssignee is required when assignmentMode is "single"
    if (data.assignmentMode === "single" && !data.currentAssignee) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "currentAssignee is required when assignmentMode is 'single'",
        path: ["currentAssignee"],
      });
    }

    // Validate rotation-specific fields
    if (data.assignmentMode === "rotation" && !data.rotationOrder?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rotationOrder is required when assignmentMode is 'rotation'",
        path: ["rotationOrder"],
      });
    }

    // Validate recurring patterns when enabled
    if (data.recurring.enabled) {
      if (data.recurring.type && !data.recurring.patterns?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "patterns are required when recurring is enabled with a type",
          path: ["recurring", "patterns"],
        });
      }

      if (data.recurring.startDate && data.recurring.endDate) {
        if (data.recurring.startDate > data.recurring.endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "endDate must be after startDate",
            path: ["recurring", "endDate"],
          });
        }
      }
    }
  });

export const createRoomTaskSchema = z.object({
  title: stringValidation(1, 100, "title"),
  description: z.string().optional(),
  createdBy: objectIdValidation,
  assignmentMode: z.enum(["single", "rotation"]).default("single"),
  currentAssignee: objectIdValidation.optional(),
  participants: z.array(objectIdValidation),
  rotationOrder: z.array(objectIdValidation).optional(),
  recurring: recurringSchema,
  status: z.enum(["pending", "completed", "skipped"]).default("pending"),
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
  recurrencePattern: stringValidation(1, 20, "recurrence pattern").optional(),
  customRecurrence: stringValidation(1, 20, "custom recurrence").optional(),
});
