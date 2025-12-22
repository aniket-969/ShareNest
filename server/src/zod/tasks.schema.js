import { objectIdValidation, stringValidation } from "./customValidator.js";
import { z } from "zod";


const selectorSchema = z.object({
  type: z.enum(["none", "weekdays", "ordinalWeekday", "monthDay"]),

  // weekly selector
  days: z
    .array(z.number().int().min(0).max(6))
    .min(1)
    .optional(),

  // monthly ordinal selector
  weekday: z.number().int().min(0).max(6).optional(),

  ordinal: z
    .enum(["first", "second", "third", "fourth", "last"])
    .optional(),

  // monthly date selector
  day: z
    .union([
      z.number().int().min(1).max(31),
      z.literal("last"),
    ])
    .optional(),
});

const recurrenceSchema = z.object({
  enabled: z.boolean(),

  frequency: z.enum(["daily", "weekly", "monthly"]),

  interval: z.coerce.number().int().min(1).default(1),

  startDate: z.coerce.date(),

  selector: selectorSchema,
});

const baseTaskSchema = {
  title: stringValidation(1, 40, "title"),
  description: stringValidation(1, 100, "description").optional(),

  assignmentMode: z.enum(["single", "rotation"]),

  participants: z.array(objectIdValidation).min(1),

  recurrence: recurrenceSchema,
};

export const taskSchema = z
  .object({
    _id: objectIdValidation.optional(),
    ...baseTaskSchema,
  })
  .superRefine((data, ctx) => {
    const { recurrence } = data;
    if (!recurrence.enabled) return;

    const { frequency, selector } = recurrence;

    // DAILY → selector must be none
    if (frequency === "daily" && selector.type !== "none") {
      ctx.addIssue({
        path: ["recurrence", "selector", "type"],
        message: "Daily recurrence must use selector type 'none'",
        code: z.ZodIssueCode.custom,
      });
    }

    // WEEKLY → selector must be weekdays with days
    if (frequency === "weekly") {
      if (selector.type !== "weekdays" || !selector.days?.length) {
        ctx.addIssue({
          path: ["recurrence", "selector"],
          message:
            "Weekly recurrence must use selector type 'weekdays' with at least one day",
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
            "Monthly recurrence must use 'ordinalWeekday' or 'monthDay' selector",
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
            "ordinalWeekday selector requires both weekday and ordinal",
          code: z.ZodIssueCode.custom,
        });
      }

      if (selector.type === "monthDay" && selector.day === undefined) {
        ctx.addIssue({
          path: ["recurrence", "selector", "day"],
          message: "monthDay selector requires day (1–31 or 'last')",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });


export const createRoomTaskSchema = z.object(baseTaskSchema);

export const updateRoomTaskSchema = z.object(baseTaskSchema).partial();
