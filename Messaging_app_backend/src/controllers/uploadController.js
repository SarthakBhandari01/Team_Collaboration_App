import { StatusCodes } from "http-status-codes";
import multer from "multer";
import streamifier from "streamifier";

import cloudinary from "../config/cloudinaryConfig.js";
import {
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

// Allowed file types and size limit (10MB)
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }
  },
}).single("file");

const getResourceType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "raw";
};

const getFileCategory = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "document";
};

const streamUpload = (buffer, resourceType) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "team_collab_uploads", resource_type: resourceType },
      (error, result) => (result ? resolve(result) : reject(error)),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "File too large. Max size is 10MB."
            : err.message,
      });
    }
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No file provided" });
    }

    try {
      const resourceType = getResourceType(req.file.mimetype);
      const result = await streamUpload(req.file.buffer, resourceType);

      return res.status(StatusCodes.OK).json(
        successResponse(
          {
            url: result.secure_url,
            publicId: result.public_id,
            fileType: getFileCategory(req.file.mimetype),
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
          },
          "File uploaded successfully",
        ),
      );
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  });
};
