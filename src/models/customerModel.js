import pool from "../config/db.js";


// Get all customers
const getAllCustomers = async () => {
  const result = await pool.query(`
    SELECT
      id,
      user_id,
      first_name,
      last_name,
      email,
      phone,
      profile_image,
      address,
      city,
      state,
      country,
      postal_code,
      status,
      created_at,
      updated_at
    FROM customers
    ORDER BY id DESC
  `);

  return result.rows;
};


// Get customer by id
const getCustomerById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      first_name,
      last_name,
      email,
      phone,
      profile_image,
      address,
      city,
      state,
      country,
      postal_code,
      status,
      created_at,
      updated_at
    FROM customers
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};


// Update customer status
const updateCustomerStatus = async (id, status) => {
  const result = await pool.query(
    `
    UPDATE customers
    SET status = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
};


// Export customer model functions
export {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
};