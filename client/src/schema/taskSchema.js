import {
  stringValidation,
  objectIdValidation,
  optionalStringValidation,
} from "@/utils/validation";
import { z } from "zod";
import { z } from "zod";

export const selectorSchema = z.object({
  type: z.enum(["none", "weekdays", "ordinalWeekday", "monthDay"]),

  // Weekly selector
  days: z
    .array(z.number().int().min(0).max(6))
    .min(1)
    .optional(),

  // Monthly ordinal selector
  weekday: z.number().int().min(0).max(6).optional(),
  ordinal: z
    .enum(["first", "second", "third", "fourth", "last"])
    .optional(),

  // Monthly date selector
  day: z
    .union([z.number().int().min(1).max(31), z.literal("last")])
    .optional(),
});

export const recurrenceSchema = z.object({
  enabled: z.boolean(),

  frequency: z.enum(["daily", "weekly", "monthly"]),

  interval: z.coerce.number().int().min(1).default(1),

  startDate: z.coerce.date(),

  selector: selectorSchema,
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(40),
  description: z.string().min(1).max(100).optional(),

  assignmentMode: z.enum(["single", "rotation"]),

  participants: z
    .array(z.string()) // ObjectId as string
    .min(1, "At least one participant is required"),

  recurrence: recurrenceSchema,
});

export const createTaskSchemaWithRules = createTaskSchema.superRefine(
  (data, ctx) => {
    const { recurrence } = data;

    if (!recurrence.enabled) return;

    const { frequency, selector } = recurrence;

    // DAILY → selector must be none
    if (frequency === "daily" && selector.type !== "none") {
      ctx.addIssue({
        path: ["recurrence", "selector", "type"],
        message: "Daily recurrence must not have a selector",
        code: z.ZodIssueCode.custom,
      });
    }

    // WEEKLY → selector must be weekdays with days
    if (frequency === "weekly") {
      if (selector.type !== "weekdays" || !selector.days?.length) {
        ctx.addIssue({
          path: ["recurrence", "selector"],
          message:
            "Weekly recurrence requires weekday selection",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // MONTHLY → selector must be ordinalWeekday or monthDay
    if (frequency === "monthly") {
      if (!["ordinalWeekday", "monthDay"].includes(selector.type)) {
        ctx.addIssue({
          path: ["recurrence", "selector", "type"],
          message:
            "Monthly recurrence must be day-of-month or ordinal weekday",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        selector.type === "ordinalWeekday" &&
        (!selector.weekday || !selector.ordinal)
      ) {
        ctx.addIssue({
          path: ["recurrence", "selector"],
          message:
            "Ordinal weekday requires both weekday and ordinal",
          code: z.ZodIssueCode.custom,
        });
      }

      if (selector.type === "monthDay" && selector.day === undefined) {
        ctx.addIssue({
          path: ["recurrence", "selector", "day"],
          message:
            "Day-of-month requires a day (1–31 or 'last')",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  }
);

export const createNormalTaskSchema = z.object({
  title: stringValidation(1, 40, "title"),
  description: optionalStringValidation(1, 100, "description"),

  assignmentMode: z.enum(["single", "rotation"]),

  participants: z
    .array(z.string()) // ObjectId
    .min(1, "At least one participant is required")
    .max(20, "Maximum 20 participants allowed"),

  // Single occurrence date
  startDate: z.date({
    required_error: "Task date is required",
  }),
});

export const updateRoomTaskSchema = z.object({
  roomId: objectIdValidation,
  taskId: objectIdValidation,
  title: stringValidation(1, 20, "title").optional(),
  description: stringValidation(5, 50, "description").optional(),
  currentAssignee: objectIdValidation.optional(),
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