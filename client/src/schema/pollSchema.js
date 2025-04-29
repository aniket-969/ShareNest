import { z } from "zod";
import { stringValidation } from "./../utils/validation";

export const pollSchema = z.object({
  title: stringValidation(1, 100, "title"),
  voteEndTime: z.date(),
  options: z
    .array(stringValidation(1, 100, "Option Text"))
    .min(2, { message: "At least two options are required" }),
}); 
