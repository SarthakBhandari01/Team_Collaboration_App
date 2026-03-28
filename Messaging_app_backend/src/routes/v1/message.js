import express from "express";

import {
  deleteMessage,
  getMessages,
} from "../../controllers/messageController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticated, getMessages);
router.delete("/:messageId", isAuthenticated, deleteMessage);

export default router;
