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
    const { chatId, text } = req.body;
    const imageFile = req.file;
    if (!senderId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (!chatId) {
      return res.status(400).json({
        message: "ChatId is missing",
      });
    }
    if (!text && !imageFile) {
      return res.status(400).json({
        message: "Either text or image is required",
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isValidUserOfChat = chat.users.some(
      (userId) => userId.toString() === senderId.toString()
    );

    if (!isValidUserOfChat) {
      return res.status(401).json({
        message: "You are not a participant of this chat",
      });
    }

    const otherUserId = chat.users.find(
      (userId) => userId.toString() !== senderId.toString()
    );
    if (!otherUserId) {
      return res.status(400).json({
        message: "Other userId is missing",
      });
    }

    /**
     * TODO: SOCKET SETUP
     */

    let messageData: any = {
      chatId: chatId,
      sender: senderId,
      seen: false,
      seenAt: undefined,
    };
    if (imageFile) {
      messageData.image = {
        url: imageFile.path,
        publicId: imageFile.filename,
      };
      messageData.messageType = "image";
      messageData.text = text || "";
    } else {
      messageData.text = text;
      messageData.messageType = "text";
    }

    const message = new MessagesModel(messageData);
    const savedMessage = await message.save();
    const latestMessage = imageFile ? "📷 Images" : text;

    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: {
          text: latestMessage,
          sender: senderId,
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    // TODO : emit to socket

    res.status(201).json({
      message: savedMessage,
      sender: senderId,
    });
  }
);

export const getMessagesByChatId = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { chatId } = req.params;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }
    if (!chatId) {
      return res.status(400).json({
        message: "ChatId is required",
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isValidUserOfChat = chat.users.some(
      (userId) => userId.toString() === userId.toString()
    );

    if (!isValidUserOfChat) {
      return res.status(401).json({
        message: "You are not a participant of this chat",
      });
    }

    const markMessageToSeen = await MessagesModel.find({
      chatId: chatId,
      sender: { $ne: userId },
      seen: false,
    });
    // if (markMessageToSeen.length > 0) {
    //   await MessagesModel.updateMany(
    //     {
    //       chatId: chatId,
    //       sender: { $ne: userId },
    //       seen: false,
    //     },
    //     {
    //       seen: true,
    //       seenAt: new Date(),
    //     }
    //   );
    // }
    if (markMessageToSeen.length > 0) {
      const ids = markMessageToSeen.map((msg) => msg._id);
      await MessagesModel.updateMany(
        { _id: { $in: ids } },
        { $set: { seen: true, seenAt: new Date() } }
      );
    }

    const messages = await MessagesModel.find({ chatId }).sort({
      createdAt: 1,
    });

    const otherUserId = chat.users.find((id) => id !== userId);
    if (!otherUserId) {
      return res.status(400).json({ message: "No other User" });
    }

    try {
      const { data } = await axios.get(
        `${USER_SERVICE}/api/v1/users/${otherUserId}`
      );
      if (!data) {
        return res.status(404).json({ message: "User not found" });
      }

      // TODO: Socket Work work with frontend

      return res.status(200).json({
        messages,
        user: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        messages,
        user: {
          _id: otherUserId,
          name: "Unknown User",
        },
      });
    }
  }
);
