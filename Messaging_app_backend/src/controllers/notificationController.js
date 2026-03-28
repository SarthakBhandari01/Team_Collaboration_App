import { StatusCodes } from "http-status-codes";

import {
  getUnreadCountService,
  getUserNotificationsService,
  markAllReadService,
  markNotificationReadService,
} from "../services/notificationService.js";
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await getUserNotificationsService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(notifications, "Notifications fetched successfully"),
      );
  } catch (error) {
    console.log("Get notifications controller error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await getUnreadCountService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(successResponse({ count }, "Unread count fetched successfully"));
  } catch (error) {
    console.log("Get unread count controller error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const markRead = async (req, res) => {
  try {
    const notification = await markNotificationReadService(
      req.params.id,
      req.user,
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(notification, "Notification marked as read"));
  } catch (error) {
    console.log("Mark read controller error:", error);
    if (error.message === "Unauthorized") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(customErrorResponse({ message: "Unauthorized" }));
    }
    if (error.message === "Notification not found") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(customErrorResponse({ message: "Notification not found" }));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const markAllRead = async (req, res) => {
  try {
    const result = await markAllReadService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(result, "All notifications marked as read"));
  } catch (error) {
    console.log("Mark all read controller error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
