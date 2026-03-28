import { StatusCodes } from "http-status-codes";
import uuid4 from "uuid4";

import channelRepository from "../repositories/channelRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clientError.js";
import validationError from "../utils/errors/validationError.js";

export const isUserAdminOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find((member) => {
    return (
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === "admin"
    );
  });
  return response;
};

export const isUserMemberOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find((member) => {
    return member.memberId._id.toString() === userId;
  });
  return response;
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuid4().substring(0, 6).toUpperCase();
    const workspace = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode,
      members: [],
      channels: [],
    });
    //add owner
    await workspaceRepository.addMemberToWorkspace(
      workspace._id,
      workspaceData.owner,
      "admin"
    );

    //add channel
    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      workspace._id,
      "general"
    );

    return updatedWorkspace;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new validationError({ error: error.errors }, error.message);
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
      throw new validationError(
        {
          error: ["Workspace with same name already exists"],
        },
        "Workspace with same name already exists"
      );
    }

    throw error;
  }
};

export const getAllWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const workspaces = await workspaceRepository.findAllWorkspaceByMemberId(
      userId
    );
    return workspaces;
  } catch (error) {
    console.log(" Get workspace user is member service error ", error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Invalid data sent from the client",
        explaination: " Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);

      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }

    throw new ClientError({
      message: "User is not allowed to delete the workspace ",
      explaination: "Invalid data sent from the client ",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  } catch (error) {
    console.log("Delete workspace service  error ", error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(
      workspaceId
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        message: "User is not member of the  workspace",
        explaination: "Invalid data sent from the client ",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
    return workspace;
  } catch (error) {
    console.log("Get Workspace Service error ", error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceByJoinCode(
      joinCode
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        message: "User is not member of the  workspace",
        explaination: "Invalid data sent from the client ",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
    return workspace;
  } catch (error) {
    console.log("Get Workspace by joinCode Service error ", error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    //check for user
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        message: "User is not allowed to delete the workspace ",
        explaination: "Invalid data sent from the client ",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    //update workspace
    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log("update Workspace Service error ", error);
    throw error;
  }
};

export const resetWorkspaceJoinCodeService = async (workspaceId, userId) => {
  try {
    const newJoinCode = uuid4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(
      workspaceId,
      {
        joinCode: newJoinCode,
      },
      userId
    );
    return updatedWorkspace;
  } catch (error) {
    console.log("Reset Workspace join code service error ", error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  userId,
  role
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        message: "User is not allowed to add member to workspace",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );
    return response;
  } catch (error) {
    console.log("Add member to workspace Service error ", error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  userId,
  channelName
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: "User is not an admin of the workspace",
        message: "User is not an admin of the workspace",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log("Add channel to workspace Service error ", error);
    throw error;
  }
};

export const joinWorkspaceService = async (workspaceId, joinCode, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(
      workspaceId
    );
    if (!workspace) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (workspace.joinCode !== joinCode) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "Invalid join code",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      userId,
      "member"
    );

    return updatedWorkspace;
  } catch (error) {
    console.log("join workspace Service error", error);
    throw error;
  }
};
