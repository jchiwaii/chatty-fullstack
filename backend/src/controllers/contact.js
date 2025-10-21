import User from "../models/user.js";
import ContactRequest from "../models/contactRequest.js";

// Get all users (potential contacts) excluding current user and existing contacts
export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    // Get all users except current user and existing contacts
    const users = await User.find({
      _id: {
        $ne: currentUserId,
        $nin: currentUser.contacts,
      },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send contact request
export const sendContactRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already contacts
    const sender = await User.findById(senderId);
    if (sender.contacts.includes(receiverId)) {
      return res.status(400).json({ message: "Already in contacts" });
    }

    // Check for existing request
    const existingRequest = await ContactRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "Request already sent" });
      }
      if (existingRequest.status === "rejected") {
        // Allow resending after rejection
        existingRequest.status = "pending";
        existingRequest.sender = senderId;
        existingRequest.receiver = receiverId;
        await existingRequest.save();
        return res.status(200).json(existingRequest);
      }
    }

    // Create new request
    const contactRequest = new ContactRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await contactRequest.save();

    // Populate sender info for response
    await contactRequest.populate("sender", "username email profilePicture");
    await contactRequest.populate("receiver", "username email profilePicture");

    res.status(201).json(contactRequest);
  } catch (error) {
    console.error("Error sending contact request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get pending contact requests (received)
export const getContactRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ContactRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "username email profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get sent contact requests
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ContactRequest.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "username email profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept contact request
export const acceptContactRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await ContactRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Update request status
    request.status = "accepted";
    await request.save();

    // Add to each other's contacts
    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { contacts: request.receiver },
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { contacts: request.sender },
    });

    res.status(200).json({ message: "Contact request accepted" });
  } catch (error) {
    console.error("Error accepting contact request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reject contact request
export const rejectContactRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await ContactRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Update request status
    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Contact request rejected" });
  } catch (error) {
    console.error("Error rejecting contact request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all contacts
export const getContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "contacts",
      "username email profilePicture bio"
    );

    res.status(200).json(user.contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove contact
export const removeContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    // Remove from both users' contacts
    await User.findByIdAndUpdate(userId, {
      $pull: { contacts: contactId },
    });

    await User.findByIdAndUpdate(contactId, {
      $pull: { contacts: userId },
    });

    res.status(200).json({ message: "Contact removed" });
  } catch (error) {
    console.error("Error removing contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
