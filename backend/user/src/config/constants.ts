import dotenv from "dotenv";
dotenv.config();

export const MONGO_URL = process.env.MONGO_URL;
export const REDIS_URL = process.env.REDIS_URL;
