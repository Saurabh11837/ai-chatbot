import express from "express";

import {
  sendMessageStream,
  getChats,
  getMessages,
  renameChat,
  deleteChat
} from "../controllers/aiChatcontroller.js";
import { optionalAuthMiddleware } from "../middleware/optionalMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* existing routes */

// router.post("/send-stream",optionalAuthMiddleware, sendMessageStream);
router.post("/send-stream",authMiddleware, sendMessageStream);

router.get("/chats",optionalAuthMiddleware, getChats);

router.get("/messages/:chatId", getMessages);

/* NEW ROUTES */

router.put("/rename/:chatId", renameChat);

router.delete("/deleteChat/:chatId", deleteChat);

export default router;