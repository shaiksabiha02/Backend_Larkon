import pool from "../config/db.js";

// Create Permission
export const createPermission = async (
  permission_name,
  description,
  status
) => {
  const query = `
    INSERT INTO permissions
    (
      permission_name,
      description,
      status
    )
    VALUES
    ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    permission_name,
    description,
    status
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


// Get All Permissions
export const getAllPermissions = async () => {
  const query = `
    SELECT *
    FROM permissions
    ORDER BY id;
  `;

  const result = await pool.query(query);

  return result.rows;
};


// Get Permission by ID
export const getPermissionById = async (id) => {
  const query = `
    SELECT *
    FROM permissions
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};


// Update Permission
export const updatePermissionById = async (id, data) => {
  const query = `
    UPDATE permissions
    SET
      permission_name = $1,
      description = $2,
      status = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
  `;

  const values = [
    data.permission_name,
    data.description,
    data.status,
    id
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


// Delete Permission
export const deletePermissionById = async (id) => {
  const query = `
    DELETE FROM permissions
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};