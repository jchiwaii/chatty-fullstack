import express from "express";
import {
  getAllUsers,
  sendContactRequest,
  getContactRequests,
  getSentRequests,
  acceptContactRequest,
  rejectContactRequest,
  getContacts,
  removeContact,
} from "../controllers/contact.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/users", protectRoute, getAllUsers);
router.get("/", protectRoute, getContacts);
router.get("/requests", protectRoute, getContactRequests);
router.get("/requests/sent", protectRoute, getSentRequests);
router.post("/request", protectRoute, sendContactRequest);
router.put("/accept/:requestId", protectRoute, acceptContactRequest);
router.put("/reject/:requestId", protectRoute, rejectContactRequest);
router.delete("/:contactId", protectRoute, removeContact);

export default router;
