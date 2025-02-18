import mongoose from "mongoose";
import { User } from "../../../DB/Models/user.model.js";
import { decryption } from "../../../utils/encryption-decryption.js";
import jwt from "jsonwebtoken";
import { emitter } from "../../../Services/send-email-service.js";
import { compareSync, hashSync } from "bcrypt";

// Get profile
export const getProfile = async (req, res) => {
  const { _id } = req.loggedInUser;

  const user = await User.findById(
    { _id },
    { userName: 1, email: 1, phone: 1 }
  );

  user.phone = await decryption({
    cipher: user.phone,
    key: process.env.E_D_KEY,
  });

  res.status(200).json({ message: "Success", user });
};

// Update profile data
export const updateProfile = async (req, res) => {
  const { userName, email, phone } = req.body;
  const { _id } = req.loggedInUser;

  const user = await User.findById({ _id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (userName) user.userName = userName;

  if (phone) {
    user.phone = await encryption({
      value: phone,
      key: process.env.E_D_KEY,
    });
  }

  if (email) {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist)
      return res.status(409).json({ message: "Email is already exist" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;

    emitter.emit("SendEmail", {
      to: email,
      subject: "Verify Your Saraha Account",
      html: `<h1>Hello in SarahaApp</h1><a href='${confirmEmailLink}'>Click to Verify</a>`,
    });
    user.email = email;
    user.isEmailVerified = false;
  }

  await user.save();
  res.status(200).json({ message: "User Updated Successfully" });
};

// Update password
export const updatePassword = async (req, res) => {
  const { oldPassword, password, confirmPassword } = req.body;
  const { _id } = req.loggedInUser;

  const user = await User.findById({ _id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordMatch = compareSync(oldPassword, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  if (oldPassword === password) {
    return res
      .status(400)
      .json({ message: "New password cannot be the same as the old password" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }

  user.password = await hashSync(password, +process.env.SALT);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};

// Delete account
export const deleteAccount = async (req, res) => {
  const { _id } = req.loggedInUser;

  const user = await User.findById({ _id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isDeleted = true;
  await user.save();

  res.status(200).json({ message: "Account deleted successfully" });
};

// De - activate Account(if needed)
export const deactivateAccount = async (req, res) => {
  const { _id } = req.loggedInUser;

  const user = await User.findById({ _id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.isEmailVerified) {
    return res.status(400).json({ message: "Account is already deactivated" });
  }

  user.isEmailVerified = false;
  await user.save();

  res.status(200).json({ message: "Account deactivated successfully" });
};

// Activate the account
export const activateAccount = async (req, res) => {
  const { _id } = req.loggedInUser;

  const user = await User.findById({ _id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ message: "Account is already activated" });
  }

  user.isEmailVerified = true;
  await user.save();

  res.status(200).json({ message: "Account activated successfully" });
};
