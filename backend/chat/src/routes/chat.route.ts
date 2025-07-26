import express from "express";
import { createNewChat } from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, createNewChat);

export default router;
