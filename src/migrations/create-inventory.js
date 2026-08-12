import pool from "../config/db.js";

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      id SERIAL PRIMARY KEY,
      product_id INTEGER UNIQUE REFERENCES products(id),
      product_name VARCHAR(150),
      stock_quantity INTEGER DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 10,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("inventory table created successfully");
} catch (error) {
  console.error("Error creating inventory table:", error);
} finally {
  await pool.end();
}