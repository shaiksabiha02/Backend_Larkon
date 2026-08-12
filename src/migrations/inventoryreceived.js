import pool from "../config/db.js";

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_received (
      id SERIAL PRIMARY KEY,
      received_id VARCHAR(30) UNIQUE NOT NULL,
      purchase_order_id INTEGER REFERENCES purchase_orders(id),
      supplier_name VARCHAR(100),
      warehouse_name VARCHAR(100),
      product_name VARCHAR(150),
      quantity INTEGER,
      unit_price DECIMAL(10,2),
      total_amount DECIMAL(12,2),
      received_date DATE,
      received_by VARCHAR(100),
      payment_status VARCHAR(30),
      status VARCHAR(30),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("inventory_received table created successfully");
} catch (error) {
  console.error("Error creating inventory_received table:", error);
} finally {
  await pool.end();
}