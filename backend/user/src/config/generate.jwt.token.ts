import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants.js";
import { ObjectId } from "mongoose";
import { IUser } from "../models/user.model.js";


export const generateToken = (user : any) => {
  return jwt.sign({ user }, JWT_SECRET as string, { expiresIn: "15days" });
};
