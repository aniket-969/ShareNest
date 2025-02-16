import { Router } from "express";
import {
  changePasswordSchema,
  loginSchema,
  paymentMethodSchema,
  registerSchema,
  updateUserSchema,
} from "./../zod/user.schema.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  addPaymentMethod,
  changePassword,
  fetchSession,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validateQRCodeData } from "../middleware/qrcode.middleware.js";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/session").get(verifyJWT,fetchSession);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshTokens").post(refreshTokens);
router
  .route("/change-password")
  .post(validate(changePasswordSchema), verifyJWT, changePassword);
router
  .route("/update-user")
  .patch(validate(updateUserSchema), verifyJWT, updateAccountDetails);
router
  .route("/payment")
  .patch(validate(paymentMethodSchema), verifyJWT, validateQRCodeData,addPaymentMethod);

export default router;
 