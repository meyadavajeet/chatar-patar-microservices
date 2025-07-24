import express from "express";
import { loginUser, myProfile, verifyLoginOTP } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyLoginOTP);

router.get("/me", isAuthenticated, myProfile);

export default router;
