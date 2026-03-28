import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js";
import { verifyToken } from "../utils/common/generateToken.js";
import {
  customErrorResponse,
  internalErrorResponse,
} from "../utils/common/responseObject.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    //check  if the jwt is passed in header
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          message: " No auth token provided ",
          explanation: "Invalid data sent from the client",
        })
      );
    }

    const response = verifyToken(token);

    const user = await userRepository.getById(response._id);
    req.user = user.id;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          message: "Invalid auth token provided",
          explanation: "Invalid data sent from the client",
        })
      );
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
