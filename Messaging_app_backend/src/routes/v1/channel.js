import express from "express";

import {
  deleteChannel,
  getChannelByIdController,
  updateChannel,
} from "../../controllers/channelController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticated, getChannelByIdController);
router.delete("/:channelId", isAuthenticated, deleteChannel);
router.put("/:channelId", isAuthenticated, updateChannel);

export default router;
