import { StatusCodes } from "http-status-codes";

import {
  addChannelToWorkspaceService,
  addMemberToWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorkspacesUserIsMemberOfService,
  getWorkspaceByJoinCodeService,
  getWorkspaceService,
  joinWorkspaceService,
  resetWorkspaceJoinCodeService,
  updateWorkspaceService,
} from "../services/workspaceService.js";
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

export const createWorkspace = async (req, res) => {
  try {
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user,
    });
    res
      .status(StatusCodes.CREATED)
      .json(successResponse(response, "Workspace created successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getAllWorkspacesUserIsMemberOf = async (req, res) => {
  try {
    const response = await getAllWorkspacesUserIsMemberOfService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(response, "Fetched all the workspaces successfully")
      );
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user;

    const response = await deleteWorkspaceService(workspaceId, userId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace Successfully deleted"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const userId = req.user;
    const workspaceId = req.params.workspaceId;
    const response = await getWorkspaceService(workspaceId, userId);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace fetched successfully"));
  } catch (error) {
    console.log("Get workspace controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getWorkspaceByJoinCode = async (req, res) => {
  try {
    const userId = req.user;
    const joinCode = req.params.joinCode;
    const response = await getWorkspaceByJoinCodeService(joinCode, userId);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace fetched successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const addMemberToWorkspace = async (req, res) => {
  try {
    const userId = req.user;
    const workspaceId = req.params.workspaceId;
    const memberId = req.body.memberId;
    const role = req.body.role || "member";
    const response = await addMemberToWorkspaceService(
      workspaceId,
      memberId,
      userId,
      role
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(response, " Member added to workspace successfully")
      );
  } catch (error) {
    console.log("Add Member to workspace controller error ", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const addChannelToWorkspace = async (req, res) => {
  try {
    const userId = req.user;
    const workspaceId = req.params.workspaceId;

    const channelName = req.body.channelName;
    const response = await addChannelToWorkspaceService(
      workspaceId,
      userId,
      channelName
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(response, " Channel added to workspace successfully")
      );
  } catch (error) {
    console.log("Add channel to workspace controller error ", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const userId = req.user;
    const workspaceId = req.params.workspaceId;
    const workspaceData = req.body;

    const response = await updateWorkspaceService(
      workspaceId,
      workspaceData,
      userId
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace updated successfully"));
  } catch (error) {
    console.log("Update workspace controller error ", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const resetJoinCodeController = async (req, res) => {
  try {
    const response = await resetWorkspaceJoinCodeService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(response, "Workspace join code reset successfully")
      );
  } catch (error) {
    console.log("reset join code controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const joinWorkspaceController = async (req, res) => {
  try {
    const response = await joinWorkspaceService(
      req.params.workspaceId,
      req.body.joinCode,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Joined workspace successfully"));
  } catch (error) {
    console.log("join workspace controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
