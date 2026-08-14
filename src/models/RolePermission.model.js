import pool from "../config/db.js";

// Create Role Permission
export const createRolePermission = async (role_id, permission_id) => {
  const result = await pool.query(
    `INSERT INTO role_permissions (role_id, permission_id)
     VALUES ($1, $2)
     RETURNING *`,
    [role_id, permission_id]
  );

  return result.rows[0];
};

// Get All Role Permissions
export const getAllRolePermissions = async () => {
  const result = await pool.query(
    `SELECT * FROM role_permissions
     ORDER BY id`
  );

  return result.rows;
};

// Get Role Permission By ID
export const getRolePermissionById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM role_permissions
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

// Update Role Permission
export const updateRolePermissionById = async (
  id,
  role_id,
  permission_id
) => {
  const result = await pool.query(
    `UPDATE role_permissions
     SET role_id = $1,
         permission_id = $2
     WHERE id = $3
     RETURNING *`,
    [role_id, permission_id, id]
  );

  return result.rows[0];
};

// Delete Role Permission
export const deleteRolePermissionById = async (id) => {
  const result = await pool.query(
    `DELETE FROM role_permissions
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};