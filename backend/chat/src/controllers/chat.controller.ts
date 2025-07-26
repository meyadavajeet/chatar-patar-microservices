import { Response } from "express";
import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated.middleware.js";
import { Chat } from "../models/Chat.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({
        message: "Other userid is required",
      });
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });
    if (existingChat) {
      return res.json({
        message: "Chat already exist",
        ChatId: existingChat._id,
      });
    }

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    return res.status(201).json({
      message: "New Chat created",
      chatId: newChat._id,
    });
  }
);
