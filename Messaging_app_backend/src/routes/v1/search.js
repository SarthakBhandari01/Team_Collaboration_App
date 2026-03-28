import express from "express";

import { searchWorkspace } from "../../controllers/searchController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, searchWorkspace);

export default router;
