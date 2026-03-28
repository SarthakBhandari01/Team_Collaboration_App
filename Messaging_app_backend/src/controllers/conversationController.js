import { StatusCodes } from "http-status-codes";

import {
  getOrCreateConversationService,
  getUserConversationsService,
  getConversationByIdService,
} from "../services/conversationService.js";
import {
  deleteDMMessageService,
  getConversationMessagesService,
} from "../services/dmMessageService.js";
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

export const getUserConversations = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    const userId = req.user;

    if (!workspaceId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Workspace ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
        }),
      );
    }

    const conversations = await getUserConversationsService(
      workspaceId,
      userId,
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(conversations, "Conversations fetched successfully"),
      );
  } catch (error) {
    console.log("Get user conversations controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const createOrGetConversation = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.body;
    const userId = req.user;

    if (!workspaceId || !memberId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Workspace ID and Member ID are required",
          statusCode: StatusCodes.BAD_REQUEST,
        }),
      );
    }

    const conversation = await getOrCreateConversationService(
      workspaceId,
      userId,
      memberId,
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(conversation, "Conversation ready"));
  } catch (error) {
    console.log("Create or get conversation controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;

    const result = await getConversationMessagesService(
      conversationId,
      userId,
      page,
      limit,
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(result, "Messages fetched successfully"));
  } catch (error) {
    console.log("Get conversation messages controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user;

    const conversation = await getConversationByIdService(
      conversationId,
      userId,
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(conversation, "Conversation fetched successfully"));
  } catch (error) {
    console.log("Get conversation by ID controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const deleteDMMessage = async (req, res) => {
  try {
    const response = await deleteDMMessageService(
      req.params.messageId,
      req.user,
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Message deleted successfully"));
  } catch (error) {
    console.log("Delete DM message controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
