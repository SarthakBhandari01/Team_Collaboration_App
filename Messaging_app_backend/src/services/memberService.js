import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const isMemberPartOfWorkspaceService = async (workspaceId, memberId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isUserAMember = isUserMemberOfWorkspace(workspace, memberId);
    if (!isUserAMember) {
      throw new ClientError({
        message: "User is not a member of workspace",
        explanation: "User is not a member of workspace",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
    const user = await userRepository.getById(memberId);
    return user;
  } catch (error) {
    console.log("Is member part of workspace service error", error);
    throw error;
  }
};
