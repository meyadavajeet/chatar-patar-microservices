import express from "express";
import { loginUser, verifyLoginOTP } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyLoginOTP);

export default router;
