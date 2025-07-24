import { Response } from "express";
import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated.middleware.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const {otherUserId} = req.body;
  }
);
