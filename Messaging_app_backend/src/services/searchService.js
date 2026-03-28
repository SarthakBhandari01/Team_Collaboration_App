import { StatusCodes } from "http-status-codes";

import searchRepository from "../repositories/searchRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const searchWorkspaceService = async (workspaceId, userId, query) => {
  try {
    // Validate workspace exists
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid workspace ID",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Validate user is a member
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        message: "User is not a member of this workspace",
        explaination: "Access denied",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    // Perform all searches in parallel
    const [channelMessages, dmMessages, channels] = await Promise.all([
      searchRepository.searchChannelMessages(workspaceId, query, 20),
      searchRepository.searchDMMessages(workspaceId, userId, query, 20),
      searchRepository.searchChannels(workspaceId, query, 10),
    ]);

    return {
      messages: channelMessages,
      dmMessages,
      channels,
    };
  } catch (error) {
    console.log("Search workspace service error", error);
    throw error;
  }
};
