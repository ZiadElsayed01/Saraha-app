import { Message } from "../../../DB/Models/message.model.js";
import { User } from "../../../DB/Models/user.model.js";

// Send message
export const sendMessage = async (req, res) => {
  const { body, ownerId } = req.body;
  const user = await User.findById(ownerId);
  if (!user) {
    return req.status(404).json({ message: "User not found" });
  }
  const message = await Message.create({
    body,
    ownerId,
  });
  res.status(201).json({ message: "Message sent successfully" });
};

// Get user messages
export const getUserMessages = async (req, res) => {
  const { _id } = req.loggedInUser;
  const messages = await Message.find({ ownerId: _id });
  res.status(200).json({ message: "Success" });
};

// Delete Message ( by owner )
export const deleteMessage = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { messageId } = req.params;
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }
  if (message.ownerId.toString() !== _id.toString()) {
    return res
      .status(403)
      .json({ message: "You can only delete your own message" });
  }
  await message.deleteOne();
  res.status(200).json({ message: "Message deleted successfully" });
};
