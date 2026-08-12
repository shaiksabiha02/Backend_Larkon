import pool from "../config/db.js";


// Create orders table
async function createOrdersTable() {
  try {
    await pool.query(`

      -- Create order status
      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM (
          'received',
          'processing',
          'shipped',
          'delivered',
          'cancelled'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;


      -- Create order priority
      DO $$ BEGIN
        CREATE TYPE order_priority AS ENUM (
          'low',
          'normal',
          'medium',
          'high'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;


      -- Create payment status
      DO $$ BEGIN
        CREATE TYPE order_payment_status AS ENUM (
          'pending',
          'completed',
          'failed',
          'refunded'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;


      -- Create orders table
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE
          DEFAULT CURRENT_TIMESTAMP,

        customer_id INT NOT NULL,

        priority order_priority
          DEFAULT 'normal',

        total_amount NUMERIC(10, 2) NOT NULL,

        payment_status order_payment_status
          DEFAULT 'pending',

        items INTEGER NOT NULL,

        delivery_number VARCHAR(20),

        status order_status
          DEFAULT 'received',

        shipping_address TEXT,

        FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE CASCADE
      );
    `);

    console.log("Orders table created successfully");

  } catch (error) {
    console.log(
      "Error creating orders table:",
      error.message
    );

  } finally {
    await pool.end();
  }
}


// Run migration
createOrdersTable();