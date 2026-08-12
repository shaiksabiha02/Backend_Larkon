import pool from "../config/db.js";

// Create Refresh Token
export const createRefreshToken = async (
  user_id,
  token,
  expires_at,
  status
) => {
  const query = `
    INSERT INTO refresh_tokens
    (
      user_id,
      token,
      expires_at,
      status
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    user_id,
    token,
    expires_at,
    status
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


// Get All Refresh Tokens
export const getAllRefreshTokens = async () => {
  const query = `
    SELECT *
    FROM refresh_tokens
    ORDER BY id DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};


// Get Refresh Token By ID
export const getRefreshTokenById = async (id) => {
  const query = `
    SELECT *
    FROM refresh_tokens
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};


// Find Refresh Token By Token
export const findRefreshToken = async (token) => {
  const query = `
    SELECT *
    FROM refresh_tokens
    WHERE token = $1;
  `;

  const result = await pool.query(query, [token]);

  return result.rows[0];
};


// Update Refresh Token By ID
export const updateRefreshTokenById = async (id, data) => {
  const {
    user_id,
    token,
    expires_at,
    status
  } = data;

  const query = `
    UPDATE refresh_tokens
    SET
      user_id = $1,
      token = $2,
      expires_at = $3,
      status = $4
    WHERE id = $5
    RETURNING *;
  `;

  const values = [
    user_id,
    token,
    expires_at,
    status,
    id
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


// Delete Refresh Token By ID
export const deleteRefreshTokenById = async (id) => {
  const query = `
    DELETE FROM refresh_tokens
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};


// Delete Refresh Token By Token
export const deleteRefreshToken = async (token) => {
  const query = `
    DELETE FROM refresh_tokens
    WHERE token = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [token]);

  return result.rows[0];
};