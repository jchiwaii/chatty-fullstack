import bcrypt from "bcryptjs";
import User from "./models/user.js";
import Message from "./models/message.js";
import ContactRequest from "./models/contactRequest.js";
import Group from "./models/group.js";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";

dotenv.config();

const users = [
  { name: "Emma Wilson", email: "emma.wilson@example.com" },
  { name: "Liam Anderson", email: "liam.anderson@example.com" },
  { name: "Olivia Martinez", email: "olivia.martinez@example.com" },
  { name: "Noah Thompson", email: "noah.thompson@example.com" },
  { name: "Ava Garcia", email: "ava.garcia@example.com" },
  { name: "Ethan Rodriguez", email: "ethan.rodriguez@example.com" },
  { name: "Sophia Lee", email: "sophia.lee@example.com" },
  { name: "Mason Walker", email: "mason.walker@example.com" },
  { name: "Isabella Hall", email: "isabella.hall@example.com" },
  { name: "Lucas Allen", email: "lucas.allen@example.com" },
  { name: "Mia Young", email: "mia.young@example.com" },
  { name: "James King", email: "james.king@example.com" },
  { name: "Charlotte Wright", email: "charlotte.wright@example.com" },
  { name: "Benjamin Scott", email: "benjamin.scott@example.com" },
  { name: "Amelia Green", email: "amelia.green@example.com" },
  { name: "Henry Baker", email: "henry.baker@example.com" },
  { name: "Harper Adams", email: "harper.adams@example.com" },
  { name: "Alexander Nelson", email: "alexander.nelson@example.com" },
  { name: "Evelyn Carter", email: "evelyn.carter@example.com" },
  { name: "Sebastian Mitchell", email: "sebastian.mitchell@example.com" },
  { name: "Abigail Perez", email: "abigail.perez@example.com" },
  { name: "Jack Roberts", email: "jack.roberts@example.com" },
  { name: "Emily Turner", email: "emily.turner@example.com" },
  { name: "Daniel Phillips", email: "daniel.phillips@example.com" },
  { name: "Elizabeth Campbell", email: "elizabeth.campbell@example.com" },
  { name: "Matthew Parker", email: "matthew.parker@example.com" },
  { name: "Sofia Evans", email: "sofia.evans@example.com" },
  { name: "David Edwards", email: "david.edwards@example.com" },
  { name: "Avery Collins", email: "avery.collins@example.com" },
  { name: "Joseph Stewart", email: "joseph.stewart@example.com" },
];

const seedUsers = async () => {
  try {
    await connectDB();

    // Delete all users EXCEPT testuser
    const testUser = await User.findOne({ email: "test@example.com" });

    if (testUser) {
      console.log(`Keeping testuser: ${testUser.email}`);

      // Delete all other users
      const deleteResult = await User.deleteMany({
        _id: { $ne: testUser._id }
      });
      console.log(`Deleted ${deleteResult.deletedCount} users`);

      // Clear testuser's contacts
      testUser.contacts = [];
      testUser.mutedChats = [];
      await testUser.save();
    } else {
      // If no testuser, delete all users
      const deleteResult = await User.deleteMany({});
      console.log(`Deleted ${deleteResult.deletedCount} users`);
    }

    // Delete all messages, contact requests, and groups
    await Message.deleteMany({});
    console.log("Deleted all messages");

    await ContactRequest.deleteMany({});
    console.log("Deleted all contact requests");

    await Group.deleteMany({});
    console.log("Deleted all groups");

    // Create 30 new users
    const hashedPassword = await bcrypt.hash("password123", 10);
    const createdUsers = [];

    for (const userData of users) {
      const user = new User({
        username: userData.name,
        email: userData.email,
        password: hashedPassword,
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.name
        )}&background=random&color=ffffff&size=200`,
        bio: `Hi, I'm ${userData.name.split(" ")[0]}!`,
      });

      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    console.log(`\n✅ Successfully seeded ${createdUsers.length} users!`);
    console.log(`\nTest accounts - All passwords are: password123`);
    console.log(`Main test account: test@example.com`);
    console.log(`\nOther users: ${users.slice(0, 5).map(u => u.email).join(", ")} ...`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
