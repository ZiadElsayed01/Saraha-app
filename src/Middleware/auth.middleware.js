import jwt from "jsonwebtoken";
import { BlackListTokens } from "./../DB/Models/black.list.tokens.js";
import { User } from "./../DB/Models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decodedData = jwt.verify(token, process.env.JWT_LOGIN_SECRETE);

    const isTokenBlackListed = await BlackListTokens.findOne({
      tokenId: decodedData.jti,
    });

    if (isTokenBlackListed)
      return res.status(401).json({ message: "Please Login First" });

    const user = await User.findById(decodedData._id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.loggedInUser = user;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token is expired, please login" });
    }
    res.status(403).json({ message: "Internal server error" });
  }
};
