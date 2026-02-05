import { z } from "zod";
import { objectIdValidation, stringValidation } from "./customValidator.js";

export const creatRoomSchema = z.object({
  name: stringValidation(1, 20, "name"),
  description: stringValidation(1, 50, "description").optional(),
  planId:z.enum(["free","pro_monthly","pro_yearly"])

});

export const updateRoomSchema = creatRoomSchema
  .partial()

export const addUserRequestSchema = z.object({
  groupCode: z.string().length(6),
});

export const adminResponseSchema = z.object({
  requestId: objectIdValidation,
  action: z.enum(["approved", "denied"]),
});

export const transferRoleSchema = z.object({
  newAdminId: objectIdValidation,
});
