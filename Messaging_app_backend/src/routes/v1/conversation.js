import express from "express";

import {
  createOrGetConversation,
  deleteDMMessage,
  getConversationById,
  getConversationMessages,
  getUserConversations,
} from "../../controllers/conversationController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getUserConversations);
router.post("/", isAuthenticated, createOrGetConversation);
router.get("/:conversationId", isAuthenticated, getConversationById);
router.get(
  "/:conversationId/messages",
  isAuthenticated,
  getConversationMessages,
);
router.delete("/messages/:messageId", isAuthenticated, deleteDMMessage);

export default router;
