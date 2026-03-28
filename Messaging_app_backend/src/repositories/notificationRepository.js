import Notification from "../schema/notification.js";
import crudRepository from "./crudRepository.js";

const notificationRepository = {
  ...crudRepository(Notification),

  getByUserId: async function (userId, limit = 50) {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("workspaceId", "name")
      .lean();
    return notifications;
  },

  getUnreadByUserId: async function (userId) {
    const notifications = await Notification.find({ userId, isRead: false })
      .sort({ createdAt: -1 })
      .populate("workspaceId", "name")
      .lean();
    return notifications;
  },

  getUnreadCount: async function (userId) {
    const count = await Notification.countDocuments({ userId, isRead: false });
    return count;
  },

  markAsRead: async function (notificationId) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
    return notification;
  },

  markAllAsRead: async function (userId) {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
    return result;
  },

  createNotification: async function (data) {
    const notification = await Notification.create(data);
    return notification;
  },
};

export default notificationRepository;
