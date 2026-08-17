import express from "express";
import upload from "../middlewares/upload.js";

import {
    fetchConversations,
    fetchConversationMessages,
    createMessage,
    readMessages,
    fetchActiveUsers,
    fetchNotifications,
    fetchProfile,
    fetchDashboard,
    searchConversations,
    changeUserStatus,
    fetchUnreadMessages,
    uploadAttachment
} from "../controllers/chat.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.use(authenticate);
// GET ALL CONVERSATIONS
router.get("/conversations", fetchConversations);

// GET CONVERSATION MESSAGES
router.get(
    "/conversations/:conversationId/messages",
    fetchConversationMessages
);

// CREATE MESSAGE
router.post(
    "/conversations/:conversationId/messages",
    createMessage
);
//mark messages as read
router.post(
  "/conversations/:conversationId/read",
  readMessages
);

// GET ACTIVE USERS
router.get(
    "/users/active",
    fetchActiveUsers
);

// notifications
router.get(
    "/notifications",
    fetchNotifications
);

// profile
router.get(
    "/profile",
    fetchProfile
);

//dashboard
router.get(
    "/dashboard",
    fetchDashboard
);

//serch
router.get(
    "/conversations/search",
    searchConversations
);

//status
router.patch(
    "/users/status",
    changeUserStatus
);

//unread
router.get(
    "/messages/unread",
    fetchUnreadMessages
);

//upload images
router.post(
  "/attachments/upload",
  upload.single("file"),
  uploadAttachment
);
export default router;