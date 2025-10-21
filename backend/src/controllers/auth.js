import e from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken } from "../lib/utils.js";
import { OAuth2Client } from "google-auth-library";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../lib/validation.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub, picture } = ticket.getPayload();

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = sub;
        await user.save();
      } else {
        const newUser = new User({
          googleId: sub,
          username: name,
          email,
          profilePicture: picture,
          isGoogleUser: true,
        });
        await newUser.save();
        user = newUser;
      }
    }

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      settings: user.settings,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Google Sign-In error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters long and can only contain letters, numbers, and underscores",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user and generate token
    generateToken(newUser._id, res);
    await newUser.save();

    // Send success response - ONLY ONE RESPONSE
    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      bio: newUser.bio,
      settings: newUser.settings,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input first
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  if (password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters long");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    const token = generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      settings: user.settings,
      createdAt: user.createdAt,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Internal server error");
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", "", { maxAge: 0 });
    return res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).send("Internal server error");
  }
};

export const checkAuth = async (req, res) => {
  try {
    console.log("CheckAuth - User from middleware:", req.user);
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture, username, email, bio } = req.body;

    if (!req.user) {
      console.error("No user found in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const updateData = {};

    // Add fields to update if they exist in the request
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updateData.username = username;
    }
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already taken" });
      }
      updateData.email = email;
    }
    if (bio !== undefined) updateData.bio = bio;

    console.log("Attempting to update user with ID:", userId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      console.error("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { notifications, readReceipts, messageSound, theme } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const updateData = { settings: {} };

    // Build settings update object
    if (notifications !== undefined) updateData.settings.notifications = notifications;
    if (readReceipts !== undefined) updateData.settings.readReceipts = readReceipts;
    if (messageSound !== undefined) updateData.settings.messageSound = messageSound;
    if (theme !== undefined) {
      if (!["light", "dark", "system"].includes(theme)) {
        return res.status(400).json({ message: "Invalid theme value" });
      }
      updateData.settings.theme = theme;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if user is a Google user
    if (req.user.isGoogleUser) {
      return res.status(400).json({ message: "Google users cannot change password" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
