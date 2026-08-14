import pool from "../config/db.js";

// Create Role
export const createRole = async (
  role_name,
  description,
  status
) => {
  const query = `
    INSERT INTO roles
    (
      role_name,
      description,
      status
    )
    VALUES
    ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    role_name,
    description,
    status
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


// Get All Roles
export const getAllRoles = async () => {
  const query = `
    SELECT *
    FROM roles
    ORDER BY id;
  `;

  const result = await pool.query(query);

  return result.rows;
};


// Get Role by ID
export const getRoleById = async (id) => {
  const query = `
    SELECT *
    FROM roles
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};


// Update Role
export const updateRoleById = async (id, data) => {
  const query = `
    UPDATE roles
    SET
      role_name = $1,
      description = $2,
      status = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
  `;

  const values = [
    data.role_name,
    data.description,
    data.status,
    id
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
// Delete Role
export const deleteRoleById = async (id) => {
  const query = `
    DELETE FROM roles
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};