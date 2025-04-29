import { stringValidation } from "./customValidator.js";
import { z } from "zod";

export const pollSchema = z.object({
  title: stringValidation(1, 100, "title"),
  status: z.enum(["active", "completed", "closed"]).optional(),
  voteEndTime: z.coerce.date().refine(
    (date) => {
      const now = new Date();
      const maxAllowedDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); 
      return date > now && date <= maxAllowedDate;
    },
    {
      message: "Vote end time must be within 7 days from now.",
    }
  ),
  options: z
    .array(stringValidation(1, 100, "Option Text"))
    .min(1, { message: "At least one option is required" }),
});
