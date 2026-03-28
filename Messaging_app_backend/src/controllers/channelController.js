import { StatusCodes } from "http-status-codes";

import {
  deleteChannelService,
  getChannelByIdService,
  updateChannelService,
} from "../services/channelService.js";
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

export const getChannelByIdController = async (req, res) => {
  try {
    const channel = await getChannelByIdService(req.params.channelId, req.user);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(channel, "Channel fetched successfully"));
  } catch (error) {
    console.log("get channel by id controller error ", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user;

    const response = await deleteChannelService(channelId, userId);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Channel deleted successfully"));
  } catch (error) {
    console.log("Delete channel controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user;
    const channelData = req.body;

    const response = await updateChannelService(channelId, channelData, userId);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Channel updated successfully"));
  } catch (error) {
    console.log("Update channel controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
