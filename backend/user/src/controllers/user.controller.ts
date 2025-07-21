import { publishToQueue } from "../config/rabbitmq.js";
import redisClient from "../config/redis.js";
import TryCatch from "../config/TryCatch.js";

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
});
