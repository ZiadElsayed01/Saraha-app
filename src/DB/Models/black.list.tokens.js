import mongoose from "mongoose";

const blackListTokensSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
    },
    expiredDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const BlackListTokens =
  mongoose.models.BlackListTokens ||
  mongoose.model("BlackListTokens", blackListTokensSchema);
