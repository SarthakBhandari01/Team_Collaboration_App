import { StatusCodes } from "http-status-codes";

import conversationRepository from "../repositories/conversationRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";
import workspaceRepository from "../repositories/workspaceRepository.js";

export const getOrCreateConversationService = async (
  workspaceId,
  userId1,
  userId2,
) => {
  try {
    // Check if conversation already exists
    let conversation = await conversationRepository.findConversationByMembers(
      workspaceId,
      userId1,
      userId2,
    );

    // If not, create a new conversation
    if (!conversation) {
      conversation = await conversationRepository.create({
        workspaceId,
        members: [userId1, userId2],
      });
      // Populate members after creation
      conversation = await conversationRepository.getConversationWithMembers(
        conversation._id,
      );
    }

    return conversation;
  } catch (error) {
    console.log("Get or create conversation service error", error);
    throw error;
  }
};

export const getUserConversationsService = async (workspaceId, userId) => {
  try {
    // Verify user is member of workspace
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid workspace ID",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        message: "User is not a member of the workspace",
        explanation: "Unauthorized access",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const conversations = await conversationRepository.getUserConversations(
      workspaceId,
      userId,
    );
    return conversations;
  } catch (error) {
    console.log("Get user conversations service error", error);
    throw error;
  }
};

export const getConversationByIdService = async (conversationId, userId) => {
  try {
    const conversation =
      await conversationRepository.getConversationWithMembers(conversationId);

    if (!conversation) {
      throw new ClientError({
        message: "Conversation not found",
        explanation: "Invalid conversation ID",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Verify user is a member of this conversation
    const isMember = conversation.members.some(
      (member) => member._id.toString() === userId,
    );
    if (!isMember) {
      throw new ClientError({
        message: "User is not a member of this conversation",
        explanation: "Unauthorized access",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    return conversation;
  } catch (error) {
    console.log("Get conversation by ID service error", error);
    throw error;
  }
};
