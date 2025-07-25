import e from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
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
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).send("Invalid credientials");
      return;
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id, res),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
    return;
  }

  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }
  if (password.length < 6) {
    res.status(400).send("Password must be at least 6 characters long");
    return;
  }

  res.send("Login endpoint");
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", "", { maxAge: 0 });
    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Internal server error");
    return;
  }
  res.send("Logout endpoint");
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
    // console.log("=== UPDATE PROFILE START ===");
    // console.log("Request headers:", req.headers);
    // console.log("Request cookies:", req.cookies);
    // console.log("User from middleware:", req.user);
    // console.log("Request body:", req.body);
    // console.log("Body size:", JSON.stringify(req.body).length);

    const { profilePicture } = req.body;

    if (!req.user) {
      console.error("No user found in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    console.log("User ID:", userId);

    if (!profilePicture) {
      console.error("No profile picture in request");
      return res.status(400).json({ message: "Profile picture is required" });
    }

    console.log("Attempting to update user with ID:", userId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      console.error("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("Profile updated successfully");
    // console.log("=== UPDATE PROFILE END ===");

    return res.status(200).json(updatedUser);
  } catch (error) {
    // console.error("=== UPDATE PROFILE ERROR ===");
    // console.error("Error message:", error.message);
    // console.error("Error stack:", error.stack);
    // console.error("Error name:", error.name);
    return res.status(500).json({ message: "Internal server error" });
  }
};
