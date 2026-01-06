import { Router } from "express";
import { verifyJWT } from "./../middleware/auth.middleware.js";
import { adminOnly, checkMember } from "../middleware/room.middleware.js";
import {
  createRoomTaskSchema,
  updateRoomTaskSchema,
} from "../zod/tasks.schema.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createRoomTask,
  createSwitchRequest,
  deleteRoomTask,
  switchRequestResponse,
} from "../controllers/tasks.controller.js";

const router = Router();

router.use(verifyJWT);
router
  .route("/:roomId")
  .post(validate(createRoomTaskSchema),  createRoomTask);
router.route("/:taskId/:roomId").delete(adminOnly, deleteRoomTask);
router
  .route("/taskSwitch/:taskId/:roomId")
  .patch(checkMember, createSwitchRequest);
router
  .route("/taskSwitchResponse/:taskId/:roomId")
  .patch(checkMember, switchRequestResponse);

export default router; 
