import pool from "../config/db.js";


// Get all sellers
const getAllSellers = async () => {
  const result = await pool.query(`
    SELECT *
    FROM sellers
    ORDER BY id DESC
  `);

  return result.rows;
};


// Create new seller
const createSeller = async (sellerData) => {
  const {
    business_name,
    owner_name,
    email,
    phone,
    website,
    logo_url,
    category,
    address,
    city,
    state,
    country,
    postal_code,
    description,
  } = sellerData;

  const result = await pool.query(
    `
    INSERT INTO sellers (
      business_name,
      owner_name,
      email,
      phone,
      website,
      logo_url,
      category,
      address,
      city,
      state,
      country,
      postal_code,
      description
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    )
    RETURNING *
    `,
    [
      business_name,
      owner_name,
      email,
      phone,
      website,
      logo_url,
      category,
      address,
      city,
      state,
      country,
      postal_code,
      description,
    ]
  );

  return result.rows[0];
};


// Update seller status
const updateSellerStatus = async (id, status) => {
  const result = await pool.query(
    `
    UPDATE sellers
    SET status = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
};


// Export seller model functions
export {
  getAllSellers,
  createSeller,
  updateSellerStatus,
};