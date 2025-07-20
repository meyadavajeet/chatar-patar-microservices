import express from "express";
import connectDb from "./config/db.js";
import redisClient from "./config/redis.js";
const app = express();

connectDb();
// redisClient;

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
