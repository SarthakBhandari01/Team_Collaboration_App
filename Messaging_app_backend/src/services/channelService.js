import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(
      channelId
    );
    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        message: "Channel not found",
        explaination: "Invalid data sent from the client ",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const isMember = isUserMemberOfWorkspace(channel.workspaceId, userId);
    if (!isMember) {
      throw new ClientError({
        message: "User is not part of workspace hence cannot access channel ",
        explaination: "User is not member of workspace",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const messages = await messageRepository.getPaginatedMessages(
      { channelId },
      1,
      20
    );
    return { ...channel._doc, messages };
  } catch (error) {
    console.log("Get channel by id Service error ", error);
    throw error;
  }
};
