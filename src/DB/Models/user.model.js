import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is already taken"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "Email is already taken"],
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    profilePicture: String,
    isDelete: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
