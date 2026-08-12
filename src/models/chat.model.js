import pool from "../config/db.js";
// ================= USER MODULE =================

// Create User
export async function createUser(data) {

    const result = await pool.query(
        `
        INSERT INTO users
        (
            first_name,
            last_name,
            email,
            password,
            profile_image,
            phone
        )
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [
            data.first_name,
            data.last_name,
            data.email,
            data.password,
            data.profile_image,
            data.phone
        ]
    );

    return result.rows[0];
}

// Get Users
export async function getUsers(){

    const result = await pool.query(
        `
        SELECT *
        FROM users
        ORDER BY id DESC
        `
    );

    return result.rows;
}

// ================= CONVERSATION MODULE =================

// Create Chat
export async function createChat(data){

    const result = await pool.query(
        `
        INSERT INTO conversations
        (
            type,
            group_name,
            group_image,
            created_by
        )
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,
        [
            data.type,
            data.group_name,
            data.group_image,
            data.created_by
        ]
    );

    return result.rows[0];
}

// ================= MEMBERS MODULE =================

// Add Member
export async function addMember(data){

    const result = await pool.query(
        `
        INSERT INTO conversation_members
        (
            conversation_id,
            user_id
        )
        VALUES($1,$2)
        RETURNING *
        `,
        [
            data.conversation_id,
            data.user_id
        ]
    );

    return result.rows[0];
}

// ================= MESSAGE MODULE =================

// Send Message
export async function sendMessage(data){

    const result = await pool.query(
        `
        INSERT INTO messages
        (
            conversation_id,
            sender_id,
            message,
            message_type,
            attachment
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            data.conversation_id,
            data.sender_id,
            data.message,
            data.message_type,
            data.attachment
        ]
    );

    return result.rows[0];
}

// Get Messages
export async function getMessages(conversation_id){

    const result = await pool.query(
        `
        SELECT *
        FROM messages
        WHERE conversation_id=$1
        ORDER BY id ASC
        `,
        [conversation_id]
    );

    return result.rows;
}

// ================= REACTION MODULE =================

// Add Reaction
export async function addReaction(data){

    const result = await pool.query(
        `
        INSERT INTO message_reactions
        (
            message_id,
            user_id,
            reaction
        )
        VALUES($1,$2,$3)
        RETURNING *
        `,
        [
            data.message_id,
            data.user_id,
            data.reaction
        ]
    );

    return result.rows[0];
}

// ================= NOTIFICATION MODULE =================

// Create Notification
export async function createNotification(data){

    const result = await pool.query(
        `
        INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES($1,$2,$3)
        RETURNING *
        `,
        [
            data.user_id,
            data.title,
            data.message
        ]
    );

    return result.rows[0];
}

// ================= ATTACHMENT MODULE =================

// Upload Attachment
export async function addAttachment(data) {
  const result = await pool.query(
    `
    INSERT INTO attachments
    (
      message_id,
      file_name,
      file_path,
      file_size
    )
    VALUES($1, $2, $3, $4)
    RETURNING *
    `,
    [
      data.message_id,
      data.file_name,
      data.file_url,
      data.file_size || null
    ]
  );

  return result.rows[0];
}

// ======================================
// Get Conversation List
// ======================================
export async function getConversations() {

    const query = `
        SELECT
            c.id AS conversation_id,

            u.id AS user_id,
            u.first_name,
            u.last_name,
            u.profile_image,
            u.status,

            lm.message AS last_message,
            lm.sent_at AS last_message_time,

            COALESCE(unread.unread_count, 0) AS unread_count

        FROM users u

        LEFT JOIN conversation_members cm
            ON u.id = cm.user_id

        LEFT JOIN conversations c
            ON c.id = cm.conversation_id

        LEFT JOIN LATERAL (
            SELECT
                m.message,
                m.sent_at
            FROM messages m
            WHERE m.conversation_id = c.id
            ORDER BY m.sent_at DESC
            LIMIT 1
        ) lm ON true

        LEFT JOIN LATERAL (
            SELECT COUNT(*) AS unread_count
            FROM messages m2
            WHERE m2.conversation_id = c.id
            AND m2.is_read = false
        ) unread ON true

        ORDER BY lm.sent_at DESC NULLS LAST, u.id;
    `;

    const result = await pool.query(query);

    return result.rows;
}

// ======================================
// Get Conversation Messages
// ======================================

export async function getConversationMessages(conversationId) {

    const query = `
        SELECT
            m.id,
            m.conversation_id,
            m.sender_id,

            u.first_name,
            u.last_name,
            u.profile_image,

            m.message,
            m.message_type,
            m.attachment,
            m.is_read,
            m.sent_at

        FROM messages m

        LEFT JOIN users u
            ON u.id = m.sender_id

        WHERE m.conversation_id = $1

        ORDER BY m.sent_at ASC;
    `;

    const result = await pool.query(query, [conversationId]);

    return result.rows;
}
// ======================================
// Search Conversations
// ======================================

export async function searchConversations(search) {

    const query = `

        SELECT

            id,

            first_name,

            last_name,

            profile_image,

            status

        FROM users

        WHERE

            first_name ILIKE $1

            OR

            last_name ILIKE $1

        ORDER BY first_name;

    `;

    const result = await pool.query(query, [`%${search}%`]);

    return result.rows;

}
// ======================================
// Update User Status
// ======================================

export async function updateUserStatus(userId, status) {

    const query = `

        UPDATE users

        SET

            status = $1,

            last_seen = CURRENT_TIMESTAMP

        WHERE id = $2

        RETURNING *;

    `;

    const result = await pool.query(query, [status, userId]);

    return result.rows[0];

}
// ======================================
// Get Unread Message Count
// ======================================

export async function getUnreadMessages(userId) {

    const query = `

        SELECT

            conversation_id,

            COUNT(*) AS unread_count

        FROM messages

        WHERE

            sender_id != $1

            AND

            is_read = FALSE

        GROUP BY conversation_id;

    `;

    const result = await pool.query(query, [userId]);

    return result.rows;

}
// ======================================
// Mark Messages As Read
// ======================================

export async function markMessagesAsRead(conversationId, userId) {

    const query = `

        UPDATE messages

        SET is_read = TRUE

        WHERE

            conversation_id = $1

            AND

            sender_id != $2

            AND

            is_read = FALSE

        RETURNING *;

    `;

    const result = await pool.query(query, [conversationId, userId]);

    return result.rows;

}

//============ACTIVATE USERS//===========
export async function getActiveUsers(){

    const query = `

        SELECT

            id,

            first_name,

            last_name,

            profile_image,

            status

        FROM users

        WHERE status='online'

        ORDER BY first_name;

    `;

    const result = await pool.query(query);

    return result.rows;

}

//====== NOTAFICATIONS===============
export async function getNotifications(userId){

    const query = `

        SELECT *

        FROM notifications

        WHERE user_id=$1

        ORDER BY created_at DESC;

    `;

    const result=await pool.query(query,[userId]);

    return result.rows;

}

//======= PROFILE=================
export async function getProfile(userId){

    const query=`

        SELECT

            id,

            first_name,

            last_name,

            email,

            profile_image,

            phone,

            status,

            last_seen

        FROM users

        WHERE id=$1;

    `;

    const result=await pool.query(query,[userId]);

    return result.rows[0];

}

// ======================================
        // Dashboard
// ======================================

export async function getDashboard(userId){

    const query=`

    SELECT

        c.id AS conversation_id,

        u.id,

        CONCAT(u.first_name,' ',u.last_name) AS full_name,

        u.profile_image,

        u.status,

        m.message,

        m.sent_at

    FROM conversations c

    INNER JOIN conversation_members cm

        ON c.id=cm.conversation_id

    INNER JOIN users u

        ON u.id=cm.user_id

    LEFT JOIN LATERAL(

        SELECT *

        FROM messages

        WHERE conversation_id=c.id

        ORDER BY sent_at DESC

        LIMIT 1

    )m ON TRUE

    WHERE

        u.id!=$1

    ORDER BY

        m.sent_at DESC NULLS LAST;

    `;

    const result=await pool.query(query,[userId]);

    return result.rows;

}
export async function saveAttachment(data) {

    const {
        message_id,
        user_id,
        file_name,
        file_url,
        file_type
    } = data;


    const result = await pool.query(
        `
        INSERT INTO attachments
        (
            message_id,
            user_id,
            file_name,
            file_url,
            file_type
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            message_id,
            user_id,
            file_name,
            file_url,
            file_type
        ]
    );


    return result.rows[0];

}