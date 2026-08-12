import pool from "../config/db.js";

// Create User
export const createUser = async (
  first_name,
  last_name,
  full_name,
  username,
  email,
  phone,
  password,
  designation,
  profile_image,
  role_id,
  status
) => {
  const query = `
    INSERT INTO users
    (
      first_name,
      last_name,
      full_name,
      username,
      email,
      phone,
      password,
      designation,
      profile_image,
      role_id,
      status
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *;
  `;

  const values = [
    first_name,
    last_name,
    full_name,
    username,
    email,
    phone,
    password,
    designation,
    profile_image,
    role_id,
    status
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


// Update User
export const updateUserById = async (id, data) => {
  const query = `
    UPDATE users
    SET
      first_name = $1,
      last_name = $2,
      full_name = $3,
      username = $4,
      email = $5,
      phone = $6,
      password = $7,
      designation = $8,
      profile_image = $9,
      role_id = $10,
      status = $11,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $12
    RETURNING *;
  `;

  const values = [
    data.first_name,
    data.last_name,
    data.full_name,
    data.username,
    data.email,
    data.phone,
    data.password,
    data.designation,
    data.profile_image,
    data.role_id,
    data.status,
    id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


// Get User by ID
export const getUserById = async (id) => {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};


// Get All Users
export const getAllUsers = async () => {
  const query = `
    SELECT *
    FROM users
    ORDER BY id;
  `;

  const result = await pool.query(query);
  return result.rows;
};


// Delete User
export const deleteUserById = async (id) => {
  const query = `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};