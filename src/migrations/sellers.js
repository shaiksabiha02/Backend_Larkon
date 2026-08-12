import "dotenv/config";
import pool from "../config/db.js";


// Create sellers table
const createSellersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,

        business_name VARCHAR(150) NOT NULL,
        owner_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(20),

        website TEXT,
        logo_url TEXT,
        category VARCHAR(100),

        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        postal_code VARCHAR(20),

        description TEXT,

        rating DECIMAL(2, 1) DEFAULT 0,
        total_products INTEGER DEFAULT 0,
        total_sales DECIMAL(12, 2) DEFAULT 0,

        status VARCHAR(20) DEFAULT 'pending'
          CHECK (
            status IN (
              'pending',
              'approved',
              'suspended',
              'rejected'
            )
          ),

        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Sellers table created successfully");

  } catch (error) {
    console.log(
      "Error creating sellers table:",
      error.message
    );

  } finally {
    await pool.end();
  }
};


// Run migration
createSellersTable();