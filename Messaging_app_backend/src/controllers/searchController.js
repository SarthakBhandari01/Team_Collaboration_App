import { StatusCodes } from "http-status-codes";

import { searchWorkspaceService } from "../services/searchService.js";
import {
  customErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

export const searchWorkspace = async (req, res) => {
  try {
    const { workspaceId, q } = req.query;

    if (!workspaceId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Workspace ID is required",
          explaination: "Missing workspaceId query parameter",
        }),
      );
    }

    if (!q || q.trim().length < 2) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Search query must be at least 2 characters",
          explaination: "Query too short",
        }),
      );
    }

    const results = await searchWorkspaceService(
      workspaceId,
      req.user,
      q.trim(),
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(results, "Search completed successfully"));
  } catch (error) {
    console.log("Search controller error", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(
        customErrorResponse({
          message: error.message,
          explaination: error.explaination,
        }),
      );
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      customErrorResponse({
        message: "Internal server error",
        explaination: "Something went wrong while searching",
      }),
    );
  }
};
