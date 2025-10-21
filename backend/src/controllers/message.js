import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedinUser = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedinUser } })
      .select("-password -__v")
      .sort({ createdAt: -1 });
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).send("Internal server error");
  }
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Internal server error");
  }
};

export const sendMessage = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  const { text, image } = req.body;

  if (!text && !image) {
    return res.status(400).send("Message text or image is required");
  }

  let imageUrl;

  try {
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = new Message({
      sender: myId,
      receiver: userToChatId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Populate sender information for real-time notification
    await newMessage.populate("sender", "username email profilePic");

    // Real-time messaging with Socket.io
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const receiverSocketId = onlineUsers.get(userToChatId);

    if (receiverSocketId) {
      // Send the message to the receiver if they're online
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Internal server error");
  }
};

// Delete entire chat with a user
export const deleteChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    // Delete all messages between the two users
    await Message.deleteMany({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    });

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).send("Internal server error");
  }
};

// Clear chat history (same as delete for now)
export const clearChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    // Delete all messages between the two users
    await Message.deleteMany({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.error("Error clearing chat:", error);
    res.status(500).send("Internal server error");
  }
};

// Mute/unmute chat
export const toggleMuteChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const user = await User.findById(myId);

    // Check if chat is already muted
    const mutedChatIndex = user.mutedChats.findIndex(
      (chat) => chat.chatId === userId && chat.chatType === "user"
    );

    if (mutedChatIndex > -1) {
      // Unmute
      user.mutedChats.splice(mutedChatIndex, 1);
    } else {
      // Mute
      user.mutedChats.push({
        chatId: userId,
        chatType: "user",
      });
    }

    await user.save();

    res.status(200).json({
      isMuted: mutedChatIndex === -1,
      message: mutedChatIndex > -1 ? "Chat unmuted" : "Chat muted",
    });
  } catch (error) {
    console.error("Error toggling mute:", error);
    res.status(500).send("Internal server error");
  }
};
