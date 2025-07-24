import express from "express";
import { PORT } from "./config/constants.js";
import connectDb from "./config/db.js";

const app = express();

const port = PORT || 5002;

app.use(express.json());
connectDb();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
