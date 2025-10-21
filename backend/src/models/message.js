import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.group;
      },
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: function () {
        return !this.receiver;
      },
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "system"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
