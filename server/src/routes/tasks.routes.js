import { Router } from "express";
import { verifyJWT } from "./../middleware/auth.middleware.js";
import { adminOnly, checkMember } from "../middleware/room.middleware.js";
import { createRoomTaskSchema, updateRoomTaskSchema } from "../zod/tasks.schema.js";
import { validate } from "../middleware/validator.middleware.js"; 
import{
  createRoomTask,
  createSwitchRequest, 
  deleteRoomTask,
  switchRequestResponse,
  updateRoomTask,
} from "../controllers/tasks.controller.js";

const router = Router();
  
router.use(verifyJWT,adminOnly)
router.route("/:roomId").post(validate(createRoomTaskSchema),createRoomTask);
router.route("/:taskId/:roomId").patch(validate(updateRoomTaskSchema), updateRoomTask);
router.route("/:taskId/:roomId").delete( deleteRoomTask);
router.route("/taskSwitch/:taskId/:roomId").post( createSwitchRequest);
router
  .route("/taskSwitchResponse/:taskId/:roomId")
  .post(  switchRequestResponse);

export default router;
