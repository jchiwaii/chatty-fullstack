import express from "express";
import {
  login,
  logout,
  signup,
  googleSignIn,
  updateProfile,
  updateSettings,
  changePassword,
  checkAuth,
} from "../controllers/auth.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/google", googleSignIn);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.put("/update-settings", protectRoute, updateSettings);

router.put("/change-password", protectRoute, changePassword);

router.get("/check", protectRoute, checkAuth);

export default router;
