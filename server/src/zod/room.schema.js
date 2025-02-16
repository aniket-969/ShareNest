import { z } from "zod";
import { objectIdValidation, stringValidation } from "./customValidator.js";

export const creatRoomSchema = z.object({
  name: stringValidation(1, 20, "name"),
  description: stringValidation(1, 50, "description").optional(),
  role: z.enum(["tenant", "landlord"]),
});

export const addUserRequestSchema = z.object({
  groupCode: z.string().length(6),
  role: z.enum(["tenant", "landlord"]),
});

export const adminResponseSchema = z.object({
  requestId: objectIdValidation,
  action: z.enum(["approved", "denined"]),
});

export const transferRoleSchema = z.object({
  newAdminId: objectIdValidation,
});
