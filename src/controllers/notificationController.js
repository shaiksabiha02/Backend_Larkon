import * as notificationService from "../services/notificationService.js";


// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications =
      await notificationService.getAllNotifications();

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to get notifications",
    });
  }
};


// Mark one notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check valid id
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id",
      });
    }

    const notification =
      await notificationService.markNotificationAsRead(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to mark notification as read",
    });
  }
};


// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const notifications =
      await notificationService.markAllNotificationsAsRead();

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      count: notifications.length,
      data: notifications,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to mark all notifications as read",
    });
  }
};


// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check valid id
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id",
      });
    }

    const notification =
      await notificationService.deleteNotification(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to delete notification",
    });
  }
};


// Export notification functions
export {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};