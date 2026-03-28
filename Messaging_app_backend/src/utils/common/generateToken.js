import jwt from "jsonwebtoken";

import { JWT_EXPIRY, JWT_SECRET } from "../../config/serverConfig.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
