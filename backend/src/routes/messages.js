import express from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteChat,
  clearChat,
  toggleMuteChat,
} from "../controllers/message.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.delete("/chat/:userId", protectRoute, deleteChat);
router.delete("/clear/:userId", protectRoute, clearChat);
router.put("/mute/:userId", protectRoute, toggleMuteChat);

export default router;
