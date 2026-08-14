import pool from "../config/db.js";

// Create Login History
export const createLoginHistory = async (
  user_id,
  ip_address,
  device,
  browser,
  status
) => {
  const result = await pool.query(
    `INSERT INTO login_history
    (user_id, ip_address, device, browser, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [user_id, ip_address, device, browser, status]
  );

  return result.rows[0];
};

// Get All Login History
export const getAllLoginHistory = async () => {
  const result = await pool.query(
    `SELECT * FROM login_history
    ORDER BY id DESC`
  );

  return result.rows;
};

// Get Login History By User
export const getLoginHistoryByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM login_history
    WHERE user_id = $1`,
    [user_id]
  );

  return result.rows;
};