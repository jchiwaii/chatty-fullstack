import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      readReceipts: {
        type: Boolean,
        default: true,
      },
      messageSound: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "dark",
      },
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    mutedChats: [
      {
        chatId: {
          type: String, // Can be userId or groupId
          required: true,
        },
        chatType: {
          type: String,
          enum: ["user", "group"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
