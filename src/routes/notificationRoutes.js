import express from "express";

import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.use(authenticate);

// Get all notifications
router.get("/", getAllNotifications);

// Mark all notifications as read
router.patch("/read-all", markAllNotificationsAsRead);

// Mark one notification as read
router.patch("/:id/read", markNotificationAsRead);

// Delete notification
router.delete("/:id", deleteNotification);


// Export router
export default router;