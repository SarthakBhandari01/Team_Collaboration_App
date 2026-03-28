import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getMessagesService = async (messageParams, page, limit, user) => {
  try {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(
      messageParams.channelId,
    );
    const workspace = channel.workspaceId;

    const isMember = isUserMemberOfWorkspace(workspace, user);
    if (!isMember) {
      throw new ClientError({
        explanation: "User is not a member of the workspace",
        message: "User is not a member of the workspace",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const paginatedMessages = await messageRepository.getPaginatedMessages(
      messageParams,
      page,
      limit,
    );
    return paginatedMessages;
  } catch (error) {
    console.log("Get messages service error ", error);
    throw error;
  }
};

export const createMessageService = async (data) => {
  const newMessage = await messageRepository.create(data);
  const messageDetails = await messageRepository.getMessageDetails(
    newMessage.id,
  );
  return messageDetails;
};

export const deleteMessageService = async (messageId, userId) => {
  try {
    const message = await messageRepository.getById(messageId);
    if (!message) {
      throw new ClientError({
        message: "Message not found",
        explanation: "The message does not exist",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Only the sender can delete their own message
    if (message.senderId.toString() !== userId.toString()) {
      throw new ClientError({
        message: "Unauthorized to delete this message",
        explanation: "You can only delete your own messages",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    await messageRepository.delete(messageId);
    return { messageId, channelId: message.channelId };
  } catch (error) {
    console.log("Delete message service error", error);
    throw error;
  }
};
