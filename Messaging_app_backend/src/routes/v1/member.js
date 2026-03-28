import express from "express";

import { isMemberPartOfWorkspace } from "../../controllers/memberController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:workspaceId", isAuthenticated, isMemberPartOfWorkspace);

export default router;
