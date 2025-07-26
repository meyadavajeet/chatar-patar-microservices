import express from "express";
import { createNewChat, getAllChats } from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, createNewChat);
router.get("/all", isAuthenticated, getAllChats);

export default router;
    