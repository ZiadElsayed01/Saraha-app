import express from "express";
import connection from "./DB/connection.js";
import routerHandler from "./utils/router.handler.js";
import { config } from "dotenv";
config();

const bootstrap = () => {
  const app = express();
  const PORT = process.env.PORT;
  app.use(express.json());

  connection();
  routerHandler(app);

  app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
  });
};
export default bootstrap;
