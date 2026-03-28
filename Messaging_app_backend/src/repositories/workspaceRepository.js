import { StatusCodes } from "http-status-codes";

import Workspace from "../schema/workspace.js";
import { isUserMemberOfWorkspace } from "../services/workspaceService.js";
import ClientError from "../utils/errors/clientError.js";
import channelRepository from "./channelRepository.js";
import crudRepository from "./crudRepository.js";
import userRepository from "./userRepository.js";

const workspaceRepository = {
  ...crudRepository(Workspace),
  getWorkspaceByName: async function (workspaceName) {
    const workspace = await Workspace.findOne({ name: workspaceName });
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return workspace;
  },
  getWorkspaceByJoinCode: async function (joinCode) {
    const workspace = await Workspace.findOne({ joinCode });
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    return workspace;
  },
  addMemberToWorkspace: async function (workspaceId, memberId, role) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const memberExist = await userRepository.getById(memberId);

    if (!memberExist) {
      throw new ClientError({
        message: "Member not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMemberAlreadyPartOfWorkspace = isUserMemberOfWorkspace(
      workspace,
      memberId
    );
    if (isMemberAlreadyPartOfWorkspace) {
      throw new ClientError({
        message: "User already exist",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    workspace.members.push({ memberId, role });

    await workspace.save();
    return workspace;
  },
  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await Workspace.findById(workspaceId).populate(
      "channels"
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
    );
    if (isChannelAlreadyPartOfWorkspace) {
      throw new ClientError({
        message: "Channel already part of workspace",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }
    const channel = await channelRepository.create({
      name: channelName,
      workspaceId: workspaceId,
    });
    workspace.channels.push(channel);
    await workspace.save();

    return workspace;
  },
  findAllWorkspaceByMemberId: async function (memberId) {
    const workspaces = await Workspace.find({
      "members.memberId": memberId,
    }).populate("members.memberId", "username email avatar");
    return workspaces;
  },
  getWorkspaceDetailsById: async function (workspaceId) {
    const workspace = await Workspace.findById(workspaceId)
      .populate("members.memberId", "username email avatar")
      .populate("channels");

    return workspace;
  },
};

export default workspaceRepository;
