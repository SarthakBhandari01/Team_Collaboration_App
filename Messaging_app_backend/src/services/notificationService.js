import notificationRepository from "../repositories/notificationRepository.js";

export const createNotification = async (
  userId,
  workspaceId,
  type,
  title,
  message,
  metadata = {},
) => {
  try {
    const notification = await notificationRepository.createNotification({
      userId,
      workspaceId,
      type,
      title,
      message,
      metadata,
    });
    return notification;
  } catch (error) {
    console.log("Create notification service error:", error);
    throw error;
  }
};

export const getUserNotificationsService = async (userId) => {
  try {
    const notifications = await notificationRepository.getByUserId(userId);
    return notifications;
  } catch (error) {
    console.log("Get user notifications service error:", error);
    throw error;
  }
};

export const getUnreadCountService = async (userId) => {
  try {
    const count = await notificationRepository.getUnreadCount(userId);
    return count;
  } catch (error) {
    console.log("Get unread count service error:", error);
    throw error;
  }
};

export const markNotificationReadService = async (notificationId, userId) => {
  try {
    const notification = await notificationRepository.getById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    if (notification.userId.toString() !== userId.toString()) {
      throw new Error("Unauthorized");
    }
    const updated = await notificationRepository.markAsRead(notificationId);
    return updated;
  } catch (error) {
    console.log("Mark notification read service error:", error);
    throw error;
  }
};

export const markAllReadService = async (userId) => {
  try {
    const result = await notificationRepository.markAllAsRead(userId);
    return result;
  } catch (error) {
    console.log("Mark all read service error:", error);
    throw error;
  }
};
