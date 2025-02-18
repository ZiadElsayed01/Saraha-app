import { globalErrorHandler } from "../Middleware/error.handler.middleware.js";
import authRouter from "../Modules/Auth/authentication.controller.js";
import messageRouter from "../Modules/Message/message.controller.js";
import { userRouter } from "../Modules/User/user.controller.js";

const routerHandler = (app) => {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome in Saraha app" });
  });

  app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(globalErrorHandler);
};

export default routerHandler;
