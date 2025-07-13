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

export const login = (req, res) => {
  // Handle login logic here
  res.send("Login endpoint");
};

export const logout = (req, res) => {
  // Handle logout logic here
  res.send("Logout endpoint");
};
