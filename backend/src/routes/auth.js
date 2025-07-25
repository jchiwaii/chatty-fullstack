import express from "express";
import { login, logout, signup, googleSignIn } from "../controllers/auth.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { updateProfile } from "../controllers/auth.js";
import { checkAuth } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/google", googleSignIn);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
