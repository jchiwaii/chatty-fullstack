import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";

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
