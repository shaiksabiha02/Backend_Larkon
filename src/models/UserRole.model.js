import pool from "../config/db.js";

// Create User Role
export const createUserRole = async (user_id, role_id) => {
  const query = `
    INSERT INTO user_roles
    (
      user_id,
      role_id
    )
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await pool.query(query, [user_id, role_id]);

  return result.rows[0];
};


// Get All User Roles
export const getAllUserRoles = async () => {
  const query = `
    SELECT *
    FROM user_roles
    ORDER BY id;
  `;

  const result = await pool.query(query);

  return result.rows;
};
// Get User Role by ID
export const getUserRoleById = async (id) => {
  const query = `
    SELECT *
    FROM user_roles
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
// Update User Role
export const updateUserRoleById = async (id, data) => {
  const query = `
    UPDATE user_roles
    SET
      user_id = $1,
      role_id = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *;
  `;

  const values = [
    data.user_id,
    data.role_id,
    id
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
// Delete User Role
export const deleteUserRoleById = async (id) => {
  const query = `
    DELETE FROM user_roles
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};