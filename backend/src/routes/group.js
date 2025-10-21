import express from "express";
import {
  createGroup,
  getUserGroups,
  getGroupDetails,
  addMembers,
  removeMember,
  leaveGroup,
  updateGroup,
  deleteGroup,
  sendGroupMessage,
  getGroupMessages,
} from "../controllers/group.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getUserGroups);
router.get("/:groupId", protectRoute, getGroupDetails);
router.put("/:groupId", protectRoute, updateGroup);
router.delete("/:groupId", protectRoute, deleteGroup);

router.post("/:groupId/members", protectRoute, addMembers);
router.delete("/:groupId/members/:memberId", protectRoute, removeMember);
router.post("/:groupId/leave", protectRoute, leaveGroup);

router.post("/:groupId/messages", protectRoute, sendGroupMessage);
router.get("/:groupId/messages", protectRoute, getGroupMessages);

export default router;
