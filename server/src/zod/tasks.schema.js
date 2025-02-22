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

const baseTaskValidation = {
  title: stringValidation(1, 100, "title"),
  description: z.string().optional(),
  assignmentMode: z.enum(["single", "rotation"]).default("single"),
  currentAssignee: objectIdValidation.optional(),
  participants: z.array(objectIdValidation),
  rotationOrder: z.array(objectIdValidation).optional(),
  recurring: recurringSchema,
  status: z.enum(["pending", "completed", "skipped"]).default("pending"),
};

// Full task schema including all fields
export const taskSchema = z
  .object({
    _id: objectIdValidation.optional(),
    ...baseTaskValidation,
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

export const createRoomTaskSchema = z.object(baseTaskValidation);

export const updateRoomTaskSchema = z.object(baseTaskValidation).partial();
