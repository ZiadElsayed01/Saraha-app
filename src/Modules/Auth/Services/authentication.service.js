import { User } from "../../../DB/Models/user.model.js";
import { compareSync, hashSync } from "bcrypt";
import { Encryption } from "../../../utils/encryption-decryption.js";
import { emitter } from "../../../Services/send-email-service.js";
import path from "path";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { BlackListTokens } from "../../../DB/Models/black.list.tokens.js";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword)
      return res
        .status(409)
        .json({ message: "Password & Confirm password not match" });

    const hashPassword = hashSync(password, +process.env.SALT);
    const encryptedPhone = await Encryption({
      value: phone,
      key: process.env.E_D_KEY,
    });

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist)
      return res.status(409).json({ message: "Email is already exist" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: 40,
    });

    const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;

    emitter.emit("SendEmail", {
      to: email,
      subject: "Verify Your Saraha Account",
      html: `<h1>Hello in SarahaApp</h1><a href='${confirmEmailLink}'>Click to Verify</a>`,
    });

    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      confirmPassword,
      phone: encryptedPhone,
    });
    res.status(200).json({ message: "user created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const verifiedUser = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Email is verified successfully", verifiedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "Invalid email or password" });

  const isPasswordMatch = compareSync(password, user.password);

  if (!isPasswordMatch)
    return res.status(404).json({ message: "Invalid email or password" });

  const accesstoken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_LOGIN_SECRETE,
    {
      expiresIn: "1h",
      jwtid: uuidv4(),
    }
  );

  const refreshtoken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRETE,
    {
      expiresIn: "2d",
      jwtid: uuidv4(),
    }
  );

  res.status(200).json({
    message: "User Logged in successfully",
    accesstoken,
    refreshtoken,
  });
};

export const refreshToken = async (req, res) => {
  const { refreshtoken } = req.headers;
  if (!refreshtoken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRETE);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const accessToken = jwt.sign(
    { _id: decoded._id, email: decoded.email },
    process.env.JWT_LOGIN_SECRETE,
    {
      expiresIn: "1h",
      jwtid: uuidv4(),
    }
  );

  res.status(200).json({
    message: "Token refreshed successfully",
    accessToken,
  });
};

export const logout = async (req, res) => {
  const { accesstoken, refreshtoken } = req.headers;
  const decodedData = jwt.verify(accesstoken, process.env.JWT_LOGIN_SECRETE);

  const decodedRefreshData = jwt.verify(
    refreshtoken,
    process.env.JWT_REFRESH_SECRETE
  );

  await BlackListTokens.insertMany([
    {
      tokenId: decodedData.jti,
      expiredDate: decodedData.exp,
    },
    {
      tokenId: decodedRefreshData.jti,
      expiredDate: decodedRefreshData.exp,
    },
  ]);
  res.status(200).json({ message: "User logged out successfully" });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(404).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not registered" });

  const otp = uuidv4();

  emitter.emit("SendEmail", {
    to: email,
    subject: "Forget Password OTP",
    html: `<h1>Hello in SarahaApp</h1><p>OTP: ${otp}</p>`,
  });

  const hashedOTP = hashSync(otp, +process.env.SALT);
  user.otp = hashedOTP;
  await user.save();
  res.status(200).json({ message: "OTP sent successfully" });
};

export const resetPassword = async (req, res) => {
  const { email, OTP, newPassword, confirmPassword } = req.body;

  if (!email || !OTP || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Email , OTP, Password and confirmPassword are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not registered" });

  const isOTPMatched = compareSync(OTP, user.otp);
  if (!isOTPMatched) return res.status(400).json({ message: "Invalid OTP" });

  const hashedPassword = hashSync(newPassword, +process.env.SALT);

  await User.updateOne(
    { email },
    { password: hashedPassword, $unset: { otp: "" } }
  );
  res.status(200).json({ message: "Password reset successfully" });
};
