import Group from "../models/group.js";
import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const creatorId = req.user._id;

    if (!name || !memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: "Name and members are required" });
    }

    // Verify all members are contacts
    const creator = await User.findById(creatorId);
    const validMembers = memberIds.filter((memberId) =>
      creator.contacts.includes(memberId)
    );

    if (validMembers.length !== memberIds.length) {
      return res
        .status(400).json({ message: "Can only add contacts to group" });
    }

    // Create group
    const group = new Group({
      name,
      description,
      creator: creatorId,
      admins: [creatorId],
      members: [creatorId, ...validMembers],
    });

    await group.save();
    await group.populate("members", "username email profilePicture");
    await group.populate("admins", "username email profilePicture");

    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all groups for current user
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({
      members: userId,
    })
      .populate("members", "username email profilePicture")
      .populate("admins", "username email profilePicture")
      .populate("creator", "username email profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get group details
export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId)
      .populate("members", "username email profilePicture")
      .populate("admins", "username email profilePicture")
      .populate("creator", "username email profilePicture");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.some((member) => member._id.toString() === userId.toString())) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add members to group (only admins)
export const addMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    if (!group.admins.includes(userId)) {
      return res.status(403).json({ message: "Only admins can add members" });
    }

    // Verify all new members are contacts
    const user = await User.findById(userId);
    const validMembers = memberIds.filter((memberId) =>
      user.contacts.includes(memberId)
    );

    // Add new members (avoid duplicates)
    validMembers.forEach((memberId) => {
      if (!group.members.includes(memberId)) {
        group.members.push(memberId);
      }
    });

    await group.save();
    await group.populate("members", "username email profilePicture");

    res.status(200).json(group);
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove member from group (only admins)
export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    if (!group.admins.includes(userId)) {
      return res.status(403).json({ message: "Only admins can remove members" });
    }

    // Cannot remove creator
    if (group.creator.toString() === memberId) {
      return res.status(400).json({ message: "Cannot remove group creator" });
    }

    // Remove member
    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    group.admins = group.admins.filter(
      (admin) => admin.toString() !== memberId
    );

    await group.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Creator cannot leave
    if (group.creator.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Creator must delete group or transfer ownership" });
    }

    // Remove user from members and admins
    group.members = group.members.filter(
      (member) => member.toString() !== userId.toString()
    );
    group.admins = group.admins.filter(
      (admin) => admin.toString() !== userId.toString()
    );

    await group.save();

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update group info (only admins)
export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, avatar } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    if (!group.admins.includes(userId)) {
      return res.status(403).json({ message: "Only admins can update group" });
    }

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (avatar) {
      const uploadedImage = await cloudinary.uploader.upload(avatar);
      group.avatar = uploadedImage.secure_url;
    }

    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete group (only creator)
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can delete
    if (group.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only creator can delete group" });
    }

    // Delete all group messages
    await Message.deleteMany({ group: groupId });

    // Delete group
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send group message
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.includes(senderId)) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    let imageUrl;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const message = new Message({
      sender: senderId,
      group: groupId,
      text,
      image: imageUrl,
    });

    await message.save();
    await message.populate("sender", "username email profilePicture");

    // Real-time messaging
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    // Send to all group members who are online
    group.members.forEach((memberId) => {
      if (memberId.toString() !== senderId.toString()) {
        const memberSocketId = onlineUsers.get(memberId.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("newGroupMessage", {
            groupId,
            message,
          });
        }
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.includes(userId)) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const messages = await Message.find({ group: groupId })
      .populate("sender", "username email profilePicture")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
