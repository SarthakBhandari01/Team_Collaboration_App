import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clientError.js";
import {
  isUserAdminOfWorkspace,
  isUserMemberOfWorkspace,
} from "./workspaceService.js";

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);
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
      20,
    );
    return { ...channel._doc, messages };
  } catch (error) {
    console.log("Get channel by id Service error ", error);
    throw error;
  }
};

export const deleteChannelService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);
    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        message: "Channel not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const workspace = await workspaceRepository.getById(
      channel.workspaceId._id,
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check if user is admin of workspace
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        message: "User is not allowed to delete the channel",
        explaination: "Only workspace admins can delete channels",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    // Delete all messages in the channel
    await messageRepository.deleteManyByFilter({ channelId });

    // Remove channel from workspace
    await workspaceRepository.update(workspace._id, {
      $pull: { channels: channelId },
    });

    // Delete the channel
    const response = await channelRepository.delete(channelId);
    return response;
  } catch (error) {
    console.log("Delete channel service error", error);
    throw error;
  }
};

export const updateChannelService = async (channelId, channelData, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);
    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        message: "Channel not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const workspace = await workspaceRepository.getById(
      channel.workspaceId._id,
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check if user is admin of workspace
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        message: "User is not allowed to update the channel",
        explaination: "Only workspace admins can update channels",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    // Update the channel
    const updatedChannel = await channelRepository.update(
      channelId,
      channelData,
    );
    return updatedChannel;
  } catch (error) {
    console.log("Update channel service error", error);
    throw error;
  }
};
