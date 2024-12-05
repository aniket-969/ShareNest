import { stringValidation } from "@/utils/validation"
import {z} from "zod"

export const createRoomSchema = z.object({
    name:stringValidation(1,20,"name"),
    description:stringValidation(1,20,"description").optional(),
    role:z.enum(["tenant","landlord"])
})

export const addUserRequestSchema = z.object({
    groupCode:z.string().length(6),
    role:z.enum(["tenant","landlord"]),
    
})