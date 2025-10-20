import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const seedTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("MongoDB connected successfully");

    // Test user credentials
    const testEmail = "test@example.com";
    const testPassword = "test123456";
    const testUsername = "testuser";

    // Check if test user already exists
    const existingUser = await User.findOne({ email: testEmail });

    if (existingUser) {
      console.log("Test user already exists!");
      console.log("Email:", existingUser.email);
      console.log("Username:", existingUser.username);

      // Update the user details
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      existingUser.password = hashedPassword;
      existingUser.profilePicture = "https://ui-avatars.com/api/?name=Test+User&background=3b82f6&color=ffffff&size=200";
      existingUser.isGoogleUser = false;
      await existingUser.save();
      console.log("Test user has been updated!");
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);

      // Create test user
      const testUser = new User({
        username: testUsername,
        email: testEmail,
        password: hashedPassword,
        profilePicture: "https://ui-avatars.com/api/?name=Test+User&background=3b82f6&color=ffffff&size=200",
        isGoogleUser: false,
      });

      await testUser.save();
      console.log("Test user created successfully!");
      console.log("Email:", testUser.email);
      console.log("Username:", testUser.username);
      console.log("Password: test123456");
    }

    console.log("\n--- Test Credentials ---");
    console.log("Email: test@example.com");
    console.log("Password: test123456");
    console.log("------------------------\n");

    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedTestUser();
