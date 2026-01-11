import { stringValidation } from "@/utils/validation"
import {z} from "zod"

export const createRoomSchema = z.object({
    name:stringValidation(1,20,"name"),
    description:stringValidation(1,50,"description").optional(),
})

export const updateRoomSchema = createRoomSchema
  .partial()


export const addUserRequestSchema = z.object({
    groupCode:z.string().length(6)
    
})