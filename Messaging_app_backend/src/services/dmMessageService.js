import { StatusCodes } from "http-status-codes";

import dmMessageRepository from "../repositories/dmMessageRepository.js";
import conversationRepository from "../repositories/conversationRepository.js";
import ClientError from "../utils/errors/clientError.js";

export const createDMMessageService = async (data) => {
  try {
    const newMessage = await dmMessageRepository.create(data);
    const messageDetails = await dmMessageRepository
      .getById(newMessage._id)
      .then((msg) =>
        dmMessageRepository.getPaginatedMessages(msg.conversationId, 1, 1),
      );

    // Update conversation's updatedAt timestamp
    await conversationRepository.update(data.conversationId, {
      updatedAt: new Date(),
    });

    return messageDetails[0];
  } catch (error) {
    console.log("Create DM message service error", error);
    throw error;
  }
};

export const getConversationMessagesService = async (
  conversationId,
  userId,
  page = 1,
  limit = 20,
) => {
  try {
    // Verify user is a member of the conversation
    const conversation =
      await conversationRepository.getConversationWithMembers(conversationId);

    if (!conversation) {
      throw new ClientError({
        message: "Conversation not found",
        explanation: "Invalid conversation ID",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

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

    const messages = await dmMessageRepository.getPaginatedMessages(
      conversationId,
      page,
      limit,
    );
    const totalMessages =
      await dmMessageRepository.getMessageCount(conversationId);

    return {
      messages,
      page,
      limit,
      totalMessages,
      totalPages: Math.ceil(totalMessages / limit),
    };
  } catch (error) {
    console.log("Get conversation messages service error", error);
    throw error;
  }
};
