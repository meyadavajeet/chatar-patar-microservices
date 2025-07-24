import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        message: "Please login Auth token not found",
      });
      return;
    }
    const token = authHeader?.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    if (!decodedToken || !decodedToken.user) {
      res.status(400).json({
        message: "Invalid token",
      });
      return;
    }
    req.user = decodedToken.user;
    next();
  } catch (error) {
    console.log("error in isAuthenticated Middleware", error);
    res.status(401).json({
      message: "Please login - JWT ERROR",
    });
    return;
  }
};
