import express from "express";

import { getMessages } from "../../controllers/messageController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticated, getMessages);
// router.post()

export default router;
