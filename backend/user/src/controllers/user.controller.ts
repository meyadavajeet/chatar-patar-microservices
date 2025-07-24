import { ObjectId } from "mongoose";
import { generateToken } from "../config/generate.jwt.token.js";
import { publishToQueue } from "../config/rabbitmq.js";
import redisClient from "../config/redis.js";
import TryCatch from "../config/TryCatch.js";
import { User } from "../models/user.model.js";
import { capitalizeFirstLetter } from "../utils/common.js";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated.middleware.js";
import { Response } from "express";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;
  const rateLimitKey = `otp:ratelimit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);
  if (rateLimit) {
    res.status(429).json({
      message:
        "Too many request. Please wait for 1 min before requesting new OTP.",
    });
  }
  const otp = Math.floor(100000 + Math.random() * 900000)
    .toFixed()
    .toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, {
    EX: 300,
  });
  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });
  const message = {
    to: email,
    subject: "Chatar-Patar app OTP code",
    body: `Your OTP is ${otp}. It is valid for 5 minutes`,
  };
  await publishToQueue("send-otp", message);
  res.status(200).json({
    message: "OTP sent to you mail",
  });
});

export const verifyLoginOTP = TryCatch(async (req, res) => {
  const { email, otp: enteredOTP } = req.body;

  if (!email || !enteredOTP) {
    res.status(400).json({
      message: "Email and OTP Required",
    });
    return;
  }

  const otpKey = `otp:${email}`;
  const storedOTP = await redisClient.get(otpKey);
  if (!storedOTP || storedOTP !== enteredOTP) {
    res.status(400).json({
      message: "Invalid or Expired OTP",
    });
    return;
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email: email });
  if (!user) {
    // create user
    const parts = email.split("@");
    const name = capitalizeFirstLetter(parts[0]);
    user = await User.create({ name, email });
  }
  if (!user) {
    res.status(500).json({
      message: "Unable to create user",
    });
    return;
  }
  const token = generateToken(user);
  return res.json({
    message: "User verified.",
    user,
    token,
  });
});

export const myProfile = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    res.json(user);
  }
);

export const updateName = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        message: "Please login",
      });
    }

    user.name = req.body.name;
    await user.save();

    const token = generateToken(user);
    return res.status(200).json({
      message: "User Updated",
      user,
      token,
    });
  }
);

export const getAllUsers = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const users = await User.find();
    return res.json(users);
  }
);

export const getUserById = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.params.id);
    return res.json(user);
  }
);
