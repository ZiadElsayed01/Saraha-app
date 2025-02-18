import { Router } from "express";
import {
  activateAccount,
  deactivateAccount,
  getProfile,
  updatePassword,
  updateProfile,
} from "./Services/profile.service.js";
import { errorHandler } from "../../Middleware/error.handler.middleware.js";
import { authMiddleware } from "../../Middleware/auth.middleware.js";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "../../Validators/user.schema.js";
import { validationSchema } from "../../Middleware/validation.middleware.js";

export const userRouter = Router();

userRouter.get("/profile", authMiddleware, errorHandler(getProfile));
userRouter.put(
  "/update-profile",
  authMiddleware,
  validationSchema(updateProfileSchema),
  errorHandler(updateProfile)
);
userRouter.patch(
  "/update-password",
  authMiddleware,
  validationSchema(updatePasswordSchema),
  errorHandler(updatePassword)
);
userRouter.post(
  "/deactivate-account",
  authMiddleware,
  errorHandler(deactivateAccount)
);
userRouter.post(
  "/activate-account",
  authMiddleware,
  errorHandler(activateAccount)
);
