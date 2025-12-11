import { Router } from "express";
import { verifyJWT } from "./../middleware/auth.middleware.js";
import {
  createExpense,
  deleteExpense,
  updateExpense,
  updatePayment,
  getSettleUpDrawer,
  getExpenses,
  settleAllWithUser
} from "../controllers/expense.controller.js";
import { checkMember } from "../middleware/room.middleware.js";
import { validate } from "./../middleware/validator.middleware.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
  updatePaymentSchema,
} from "../zod/expense.schema.js";

const router = Router();

router
  .route("/:roomId")
  .post(verifyJWT, validate(createExpenseSchema), checkMember, createExpense).get(verifyJWT,checkMember,getExpenses);

  router.route("/:roomId/settle-up")
  .get(verifyJWT,getSettleUpDrawer);
  router.route("/:roomId/settle-up/:owedToUserId")
  .get(verifyJWT,settleAllWithUser);

router
  .route("/:expenseId/payment")
  .patch(verifyJWT, validate(updatePaymentSchema), updatePayment);

router
  .route("/:expenseId")
  .patch(verifyJWT, validate(updateExpenseSchema), updateExpense)
  .delete(verifyJWT, deleteExpense);

export default router;
