import express from "express";
import {
  getAllUsers,
  getUserById,
  loginUser,
  myProfile,
  updateName,
  verifyLoginOTP,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyLoginOTP);

router.get("/me", isAuthenticated, myProfile);
router.get("/all", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);
router.put("/update-name", isAuthenticated, updateName);

export default router;
