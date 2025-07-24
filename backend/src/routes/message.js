import express from "express";
import { getUsersForSidebar } from "../controllers/message.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages } from "../controllers/message.js";
import { sendMessage } from "../controllers/message.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get(":id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
