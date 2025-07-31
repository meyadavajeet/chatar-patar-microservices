import express from "express";
import {
  createNewChat,
  getAllChats,
  getMessagesByChatId,
  sendMessage,
} from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, createNewChat);
router.get("/all", isAuthenticated, getAllChats);
router.post(
  "/send-message",
  isAuthenticated,
  upload.single("image"),
  sendMessage
);

router.get("/message/:chatId", isAuthenticated, getMessagesByChatId);

export default router;
