import { Router } from "express";
import { errorHandler } from "../../Middleware/error.handler.middleware.js";
import {
  forgetPassword,
  logIn,
  logout,
  refreshToken,
  resetPassword,
  signUp,
  verifyEmail,
} from "./Services/authentication.service.js";
import {
  signUpSchema,
  loginSchema,
  verifyEmailSchema,
  refreshTokenSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../../Validators/auth.schema.js";
import { validationSchema } from "../../Middleware/validation.middleware.js";
const authRouter = Router();

authRouter.post(
  "/signup",
  validationSchema(signUpSchema),
  errorHandler(signUp)
);

authRouter.post("/login", validationSchema(loginSchema), errorHandler(logIn));

authRouter.get(
  "/verify/:token",
  validationSchema(verifyEmailSchema),
  errorHandler(verifyEmail)
);

authRouter.post(
  "/refresh-token",
  validationSchema(refreshTokenSchema),
  errorHandler(refreshToken)
);

authRouter.post("/logout", errorHandler(logout));

authRouter.post(
  "/forget-password",
  validationSchema(forgetPasswordSchema),
  errorHandler(forgetPassword)
);

authRouter.patch(
  "/reset-password",
  validationSchema(resetPasswordSchema),
  errorHandler(resetPassword)
);

export default authRouter;
