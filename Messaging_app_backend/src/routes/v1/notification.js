import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from "../../controllers/notificationController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.get("/unread-count", isAuthenticated, getUnreadCount);
router.put("/read-all", isAuthenticated, markAllRead);
router.put("/:id/read", isAuthenticated, markRead);

export default router;
