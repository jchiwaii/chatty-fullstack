import e from "express";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validate input
    if (!username || !email || !password) {
      res.status(400).send("All fields are required");
      return;
    }

    if (password.length < 6) {
      res.status(400).send("Password must be at least 6 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).send("Invalid email format");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      res
        .status(400)
        .send(
          "Username must be at least 3 characters long and can only contain letters, numbers, and underscores"
        );
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send("User with this email already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        token: generateToken(newUser._id, res),
      });
    } else {
      res.status(500).send("Error creating user");
      return;
    }

    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Internal server error");
    return;
  }

  res.send("Signup endpoint");
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

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({ updatedUser });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const checkAuth = (req, res) => {
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
    });
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};
