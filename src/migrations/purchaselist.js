import pool from "../config/db.js";

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS purchase_list (
      id SERIAL PRIMARY KEY,
      purchase_order_id INTEGER REFERENCES purchase_orders(id),
      supplier_name VARCHAR(100),
      product_name VARCHAR(150),
      category VARCHAR(100),
      quantity INTEGER,
      unit_price DECIMAL(10,2),
      total_amount DECIMAL(12,2),
      purchase_date DATE,
      status VARCHAR(30),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("purchase_list table created successfully");
} catch (error) {
  console.error("Error creating purchase_list table:", error);
} finally {
  await pool.end();
}