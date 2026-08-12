import pool from "../config/db.js";

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id SERIAL PRIMARY KEY,
      purchase_id VARCHAR(30) UNIQUE NOT NULL,
      supplier_name VARCHAR(100),
      warehouse_name VARCHAR(100),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER,
      unit_price DECIMAL(10,2),
      total_amount DECIMAL(12,2),
      purchase_status VARCHAR(30),
      payment_method VARCHAR(50),
      payment_status VARCHAR(30),
      order_date DATE,
      expected_delivery DATE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("purchase_orders table created successfully");
} catch (error) {
  console.error("Error creating purchase_orders table:", error);
} finally {
  await pool.end();
}