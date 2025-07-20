import express from "express";
import connectDb from "./config/db.js";
import redisClient from "./config/redis.js";
import userRoutes from "./routes/user.route.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
const app = express();

connectDb();
// redisClient;
connectRabbitMQ()

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
