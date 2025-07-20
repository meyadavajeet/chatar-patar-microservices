import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const RABBIT_MQ_HOSTNAME = process.env.RABBIT_MQ_HOST;
export const RABBIT_MQ_PORT = process.env.RABBIT_MQ_PORT;
export const RABBIT_MQ_USERNAME = process.env.RABBIT_MQ_USERNAME;
export const RABBIT_MQ_PASSWORD = process.env.RABBIT_MQ_PASSWORD;

export const  SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

