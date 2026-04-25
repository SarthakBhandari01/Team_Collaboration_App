import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV || "development";

export const DEV_DB_URL = process.env.DEV_DB_URL;

export const JWT_SECRET = process.env.JWT_SECRET;

export const PROD_DB_URL = process.env.PROD_DB_URL;

export const JWT_EXPIRY = process.env.JWT_EXPIRY;

export const MAIL_ID = process.env.MAIL_ID;

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
