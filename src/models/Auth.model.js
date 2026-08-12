import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT 
       u.*,
       r.role_name
     FROM users u
     LEFT JOIN roles r
       ON u.role_id = r.id
     WHERE u.email = $1`,
    [email]
  );

  return result.rows[0];
};