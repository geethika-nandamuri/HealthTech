import express from "express";
import { getChatResponse } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", getChatResponse);

export default router;
