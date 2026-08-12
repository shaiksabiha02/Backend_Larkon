import pool from "../config/db.js";

// Create Password Reset
export const createPasswordReset = async (
  user_id,
  reset_token,
  expires_at,
  status
) => {
  const query = `
    INSERT INTO password_resets
    (
      user_id,
      reset_token,
      expires_at,
      status
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    user_id,
    reset_token,
    expires_at,
    status
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
// Get All Password Resets
export const getAllPasswordResets = async () => {
  const query = `
    SELECT *
    FROM password_resets
    ORDER BY id;
  `;

  const result = await pool.query(query);

  return result.rows;
};
// Get Password Reset by ID
export const getPasswordResetById = async (id) => {
  const query = `
    SELECT *
    FROM password_resets
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
// Update Password Reset
export const updatePasswordResetById = async (id, data) => {
  const query = `
    UPDATE password_resets
    SET
      user_id = $1,
      reset_token = $2,
      expires_at = $3,
      status = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *;
  `;

  const values = [
    data.user_id,
    data.reset_token,
    data.expires_at,
    data.status,
    id
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
// Delete Password Reset
export const deletePasswordResetById = async (id) => {
  const query = `
    DELETE FROM password_resets
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};