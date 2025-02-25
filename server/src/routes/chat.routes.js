import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { deleteMessage, getAllMessages, sendMessage } from "../controllers/chat.controller.js";
import { sendMessageSchema } from "../zod/chat.schema.js";

const router = Router(); 

router.use(verifyJWT)
router.route("/:roomId").get(getAllMessages).post(validate(sendMessageSchema),sendMessage)
router
  .route("/:roomId/:messageId") 
  .delete(
    deleteMessage
  ); 
 
export default router;
