import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;

export const MONGO_URL = process.env.MONGO_URL;
export const REDIS_URL = process.env.REDIS_URL;

export const RABBIT_MQ_HOSTNAME = process.env.RABBIT_MQ_HOST;
export const RABBIT_MQ_PORT = process.env.RABBIT_MQ_PORT;
export const RABBIT_MQ_USERNAME = process.env.RABBIT_MQ_USERNAME;
export const RABBIT_MQ_PASSWORD = process.env.RABBIT_MQ_PASSWORD;

export const JWT_SECRET = process.env.JWT_SECRET;




