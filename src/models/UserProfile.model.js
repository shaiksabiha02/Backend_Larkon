import pool from "../config/db.js";

// Create User Profile
export const createUserProfile = async (
  user_id,
  full_name,
  designation,
  profile_image,
  address,
  bio
) => {
  const result = await pool.query(
    `INSERT INTO user_profiles
    (user_id, full_name, designation, profile_image, address, bio)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [user_id, full_name, designation, profile_image, address, bio]
  );

  return result.rows[0];
};

// Get User Profile
export const getUserProfile = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM user_profiles
    WHERE user_id = $1`,
    [user_id]
  );

  return result.rows[0];
};

// Update User Profile
export const updateUserProfile = async (
  user_id,
  full_name,
  designation,
  profile_image,
  address,
  bio
) => {
  const result = await pool.query(
    `UPDATE user_profiles
    SET full_name = $1,
        designation = $2,
        profile_image = $3,
        address = $4,
        bio = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $6
    RETURNING *`,
    [full_name, designation, profile_image, address, bio, user_id]
  );

  return result.rows[0];
};