import {
  getAllNotifications as getAllNotificationsFromModel,
  markNotificationAsRead as markNotificationAsReadInModel,
  markAllNotificationsAsRead as markAllNotificationsAsReadInModel,
  deleteNotification as deleteNotificationInModel,
} from "../models/notificationModel.js";


// Get all notifications
const getAllNotifications = async () => {
  return await getAllNotificationsFromModel();
};


// Mark one notification as read
const markNotificationAsRead = async (id) => {
  return await markNotificationAsReadInModel(id);
};


// Mark all notifications as read
const markAllNotificationsAsRead = async () => {
  return await markAllNotificationsAsReadInModel();
};


// Delete notification
const deleteNotification = async (id) => {
  return await deleteNotificationInModel(id);
};


// Export notification service functions
export {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};