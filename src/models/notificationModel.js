import pool from "../config/db.js";


// Get all notifications
const getAllNotifications = async () => {
  const result = await pool.query(`
    SELECT
      id,
      user_id,
      title,
      message,
      is_read,
      created_at
    FROM notifications
    ORDER BY id DESC
  `);

  return result.rows;
};


// Mark one notification as read
const markNotificationAsRead = async (id) => {
  const result = await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};


// Mark all notifications as read
const markAllNotificationsAsRead = async () => {
  const result = await pool.query(`
    UPDATE notifications
    SET is_read = true
    WHERE is_read = false
    RETURNING *
  `);

  return result.rows;
};


// Delete notification
const deleteNotification = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM notifications
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};


// Export notification model functions
export {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};