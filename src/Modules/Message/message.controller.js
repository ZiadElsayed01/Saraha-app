import { Router } from "express";
import {
  sendMessage,
  getUserMessages,
  deleteMessage,
} from "./Services/message.service.js";
import { errorHandler } from "./../../Middleware/error.handler.middleware.js";
import { authMiddleware } from "../../Middleware/auth.middleware.js";
import { validationSchema } from "../../Middleware/validation.middleware.js";
import { sendMessageSchema } from "../../Validators/message.schema.js";

const messageRouter = Router();

messageRouter.post(
  "/send-message",
  validationSchema(sendMessageSchema),
  errorHandler(sendMessage)
);
messageRouter.get(
  "/get-user-messages",
  authMiddleware,
  errorHandler(getUserMessages)
);
messageRouter.delete(
  "/delete-message/:messageId",
  authMiddleware,
  errorHandler(deleteMessage)
);

export default messageRouter;
