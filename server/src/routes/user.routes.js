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
  updateFcmToken,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validateQRCodeData } from "../middleware/qrcode.middleware.js";
import { loginLimiter, sessionLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.route("/register").post(loginLimiter,validate(registerSchema), registerUser);
router.route("/login").post(loginLimiter,validate(loginSchema), loginUser);
router.route("/session").get(sessionLimiter ,verifyJWT,fetchSession);
 
// secured routes
router
  .route("/me")
  .patch(verifyJWT,validate(updateUserSchema), updateAccountDetails);

router.route("/me/logout").post(verifyJWT, logoutUser);
router
  .route("/me/token")
  .patch(updateFcmToken);
router.route("/refreshTokens").post(refreshTokens);
router
  .route("/me/password")
  .patch(validate(changePasswordSchema), changePassword);
router
  .route("/me/payments")
  .patch(validate(paymentMethodSchema), verifyJWT, validateQRCodeData,addPaymentMethod);

export default router;
 