import express from "express";

import { uploadFile } from "../../controllers/uploadController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/v1/uploads - Upload a file to Cloudinary (authenticated)
router.post("/", isAuthenticated, uploadFile);

export default router;
