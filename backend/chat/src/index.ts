import express from "express";
import { PORT } from "./config/constants.js";
import connectDb from "./config/db.js";
import chatRoute from "./routes/chat.route.js";

const app = express();

const port = PORT || 5002;

connectDb();
app.use(express.json());

//  chat routes
app.use("/api/v1/chat", chatRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
