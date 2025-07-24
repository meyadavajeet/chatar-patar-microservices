import express from "express";
import connectDb from "./config/db.js";
import redisClient from "./config/redis.js";
import userRoutes from "./routes/user.route.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { PORT } from "./config/constants.js";
import cors from 'cors';
const app = express();

connectDb();
redisClient;
connectRabbitMQ()

const port = PORT || 5000;

app.use(express.json());
app.use(cors())
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
