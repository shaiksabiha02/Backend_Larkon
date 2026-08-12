// Import models
import {
    createUser,
    getUsers,
    createChat,
    addMember,
    sendMessage,
    getMessages,
    addReaction,
    createNotification,
    addAttachment,
    getConversations,
    getConversationMessages,
    searchConversations as searchConversationDB,
    updateUserStatus,
    getUnreadMessages,
    markMessagesAsRead,
    getActiveUsers,
    getNotifications,
    getProfile,
    getDashboard
} from "../models/chat.model.js";
import cloudinary from "../config/cloudinary.js";

// Time Formatting Helper Function

function formatChatTime(date) {

    const now = new Date();
    const messageDate = new Date(date);


    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );


    const msgDate = new Date(
        messageDate.getFullYear(),
        messageDate.getMonth(),
        messageDate.getDate()
    );


    const diffDays = Math.floor(
        (today - msgDate) /
        (1000 * 60 * 60 * 24)
    );


    if (diffDays === 0) {

        return messageDate.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    }


    if (diffDays === 1) {

        return "Yesterday";

    }


    return messageDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );

}

// Create User
export async function addUser(req, res) {

    try {

        const user = await createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Get All Users
export async function fetchUsers(req, res) {

    try {

        const users = await getUsers();

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Create Chat
export async function addChat(req, res) {

    try {

        const chat = await createChat(req.body);

        res.status(201).json({
            success: true,
            message: "Chat Created Successfully",
            data: chat
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Add Member
export async function createMember(req, res) {

    try {

        const member = await addMember(req.body);

        res.status(201).json({
            success: true,
            message: "Member Added Successfully",
            data: member
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Send Message
export async function createMessage(req, res) {

    try {

        const { conversationId } = req.params;

        const {
            sender_id,
            message,
            message_type,
            attachment
        } = req.body;

        if (!sender_id || !message) {
            return res.status(400).json({
                success: false,
                message: "sender_id and message are required"
            });
        }

        const messageData = {
            conversation_id: conversationId,
            sender_id,
            message,
            message_type: message_type || "text",
            attachment: attachment || null
        };

        const newMessage = await sendMessage(messageData);

        // Socket.IO Real-time Broadcast
        const io = req.app.get("io");

        if (io) {
            io.to(`conversation_${conversationId}`).emit(
                "newMessage",
                newMessage
            );
        }

        res.status(201).json({
            success: true,
            message: "Message Sent Successfully",
            data: newMessage
        });

    } catch (error) {

        console.error("Create Message Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get Messages
export async function fetchMessages(req, res) {

    try {

        const messages = await getMessages(req.params.conversationId);

        res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Add Reaction
export async function createReaction(req, res) {

    try {

        const reaction = await addReaction(req.body);

        res.status(201).json({
            success: true,
            message: "Reaction Added Successfully",
            data: reaction
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Search Users

export async function searchUsers(req, res) {

    try {

        const { search } = req.query;

        const users = await getUsers(search);


        res.status(200).json({

            success: true,
            message: "Search Users",
            data: users

        });


    } catch(error) {

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

}

// Create Notification
export async function addNotification(req, res) {

    try {

        const notification = await createNotification(req.body);

        res.status(201).json({
            success: true,
            message: "Notification Created Successfully",
            data: notification
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ======================================
// Upload Attachment
// ======================================
export async function uploadAttachment(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required"
      });
    }

    const {
      message_id,
      user_id
    } = req.body;

    if (!message_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "message_id and user_id are required"
      });
    }

// Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto"
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    // Save attachment in database
    const attachment = await addAttachment({
  message_id: Number(message_id),
  file_name: req.file.originalname,
  file_url: result.secure_url,
  file_size: req.file.size
});
    return res.status(201).json({
      success: true,
      message: "Attachment Uploaded Successfully",
      data: attachment
    });

  } catch (error) {

    console.error("Upload Attachment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// ======================================
        // Get Conversation List
// ======================================
export async function fetchConversations(req, res) {

    try {

        const conversations = await getConversations();

        return res.status(200).json({
            success: true,
            message: "Conversation List",
            data: conversations
        });

    } catch (error) {

        console.error("Fetch Conversations Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// ======================================
// Get Conversation Messages
// ======================================
export async function fetchConversationMessages(req, res) {
    try {

        const { conversationId } = req.params;

        const messages = await getConversationMessages(
            conversationId
        );

        res.status(200).json({
            success: true,
            message: "Conversation Messages",
            data: messages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


// ======================================
// Search Conversations
// ======================================
export async function searchConversations(req, res) {

    try {

        const { search } = req.query;

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "search is required"
            });
        }

        const conversations = await searchConversationDB(search);

        res.status(200).json({
            success: true,
            message: "Search Results",
            data: conversations
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// ======================================
// Update User Status
// ======================================
export async function changeUserStatus(req, res) {

    try {

        const { user_id, status } = req.body;

        const user = await updateUserStatus(
            user_id,
            status
        );

        res.status(200).json({
            success: true,
            message: "Status Updated Successfully",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// ======================================
// Get Unread Messages
// ======================================
export async function fetchUnreadMessages(req, res) {

    try {

        const { user_id } = req.query;

        const unread = await getUnreadMessages(
            user_id
        );

        res.status(200).json({
            success: true,
            data: unread
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// ======================================
// Mark Messages As Read
// ======================================
export async function readMessages(req, res) {

    try {

        const { conversationId } = req.params;

        const { user_id } = req.body;

        const messages = await markMessagesAsRead(
            conversationId,
            user_id
        );

        res.status(200).json({
            success: true,
            message: "Messages marked as read",
            data: messages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

//=======ACTIVE USERS ==================
export async function fetchActiveUsers(req, res) {

    try {

        const users = await getActiveUsers();

        res.status(200).json({

            success: true,

            data: users

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

//===========NOTIFICATIONS==========
export async function fetchNotifications(req, res) {

    try {

        const { user_id } = req.query;

        const notifications = await getNotifications(user_id);

        res.status(200).json({

            success: true,

            data: notifications

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}


// ======================================
                 // PROFILE
// ======================================
export async function fetchProfile(req, res) {

    try {

        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id is required"
            });
        }

        const profile = await getProfile(user_id);

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// ======================================
// Dashboard
// ======================================

export async function fetchDashboard(req, res) {

    try {

        const { user_id } = req.query;

        const dashboard = await getDashboard(user_id);

        res.status(200).json({

            success: true,

            total: dashboard.length,

            data: dashboard

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
