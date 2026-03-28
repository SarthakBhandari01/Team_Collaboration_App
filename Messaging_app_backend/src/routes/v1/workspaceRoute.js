import express from "express";

import {
  addChannelToWorkspace,
  addMemberToWorkspace,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspacesUserIsMemberOf,
  getWorkspace,
  getWorkspaceByJoinCode,
  joinWorkspaceController,
  resetJoinCodeController,
  updateWorkspace,
} from "../../controllers/workspaceController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  workspaceSchema,
} from "../../validators/workspaceSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.put("/:workspaceId/join", isAuthenticated, joinWorkspaceController);
router.post("/", validate(workspaceSchema), isAuthenticated, createWorkspace);
router.get("/", isAuthenticated, getAllWorkspacesUserIsMemberOf);
router.delete("/:workspaceId", isAuthenticated, deleteWorkspace);
router.get("/:workspaceId", isAuthenticated, getWorkspace);
router.get("/join/:joinCode", isAuthenticated, getWorkspaceByJoinCode);
router.put("/:workspaceId", isAuthenticated, updateWorkspace);
router.put(
  "/:workspaceId/members",
  validate(addMemberToWorkspaceSchema),
  isAuthenticated,
  addMemberToWorkspace
);
router.put(
  "/:workspaceId/channels",
  validate(addChannelToWorkspaceSchema),
  isAuthenticated,
  addChannelToWorkspace
);
router.put(
  "/:workspaceId/joinCode/reset",
  isAuthenticated,
  resetJoinCodeController
);
export default router;
