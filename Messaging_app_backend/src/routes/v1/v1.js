import express from "express";

import channelRouter from "./channel.js";
import conversationRouter from "./conversation.js";
import memberRouter from "./member.js";
import messageRouter from "./message.js";
import notificationRouter from "./notification.js";
import searchRouter from "./search.js";
import uploadRouter from "./upload.js";
import userRouter from "./user.js";
import workspaceRouter from "./workspaceRoute.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/workspaces", workspaceRouter);
router.use("/channels", channelRouter);
router.use("/members", memberRouter);
router.use("/messages", messageRouter);
router.use("/conversations", conversationRouter);
router.use("/search", searchRouter);
router.use("/notifications", notificationRouter);
router.use("/uploads", uploadRouter);

export default router;
