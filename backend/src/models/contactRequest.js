import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate requests
contactRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);
export default ContactRequest;
