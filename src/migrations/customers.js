import "dotenv/config";
import pool from "../config/db.js";


// Create customers table
const createCustomersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
      );
    `);

    console.log("Customers table created successfully");

  } catch (error) {
    console.log(
      "Error creating customers table:",
      error.message
    );

  } finally {
    await pool.end();
  }
};


// Run migration
createCustomersTable();