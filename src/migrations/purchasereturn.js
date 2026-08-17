import pool from "../config/db.js";

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS purchase_returns (
      id SERIAL PRIMARY KEY,
      return_id VARCHAR(30) UNIQUE NOT NULL,
      purchase_order_id INTEGER REFERENCES purchase_orders(id),
      supplier_name VARCHAR(100),
      warehouse_name VARCHAR(100),
      product_name VARCHAR(150),
      quantity INTEGER,
      return_reason TEXT,
      return_status VARCHAR(30),
      refund_amount DECIMAL(12,2),
      return_date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("purchase_returns table created successfully");
} catch (error) {
  console.error("Error creating purchase_returns table:", error);
} finally {
  await pool.end();
}