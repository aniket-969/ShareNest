import { z } from "zod";
import {
  dateSchema,
  objectIdValidation,
  stringValidation,
} from "./customValidator.js";

export const createCalendarEventSchema = z
  .object({
    title: stringValidation(1, 10, "title"),
    description: stringValidation(1, 50, "description").optional(),
    recurrencePattern: z.enum(["weekly", "monthly", "yearly"]).optional(),
    isRecurring: z.boolean().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      const { startDate, endDate } = data;

      if (!startDate || !endDate) return true;
      return endDate >= startDate;
    },
    {
      message: "End date must be greater than or equal to start date",
      path: ["endDate"],
    }
  );
