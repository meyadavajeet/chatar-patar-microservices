import { Response } from "express";
import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated.middleware.js";
import { Chat } from "../models/Chat.js";
import { MessagesModel } from "../models/Messages.js";
import axios from "axios";
import { USER_SERVICE } from "../config/constants.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "UserId is missing",
      });
    }

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

export const getAllChats = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        message: "UserId is missing",
      });
    }
    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    const chatWithUserData = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => id !== userId);
        const unseenCount = await MessagesModel.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          seen: false,
        });
        try {
          const { data } = await axios.get(
            `${USER_SERVICE}/api/v1/users/${otherUserId}`
          );
          return {
            user: data,
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount: unseenCount,
            },
          };
        } catch (error) {
          console.log(error);
          return {
            user: {
              _id: otherUserId,
              name: "Unknown user",
            },
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount: unseenCount,
            },
          };
        }
      })
    );
    return res.json({ chats: chatWithUserData });
  }
);

export const sendMessage = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const senderId = req.user?._id;
    const {chatId , text } = req.body;
    const imageFile = req.file;
  }
);
