import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    body: {
      required: true,
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Message =
  mongoose.Message || mongoose.model("Message", messageSchema);
