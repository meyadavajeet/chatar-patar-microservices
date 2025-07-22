import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants.js";
import { ObjectId } from "mongoose";

export const generateToken = (_id: ObjectId) => {
  return jwt.sign({ _id }, JWT_SECRET as string, { expiresIn: "15days" });
};
