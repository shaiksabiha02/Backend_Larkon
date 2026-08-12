import "dotenv/config";
import pool from "../config/db.js";


// Create notifications table
const createNotificationsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'general',
        is_read BOOLEAN DEFAULT FALSE,

        customer_id INTEGER
        REFERENCES customers(id)
        ON DELETE CASCADE,

        seller_id INTEGER
        REFERENCES sellers(id)
        ON DELETE CASCADE,

        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Notifications table created successfully");

  } catch (error) {
    console.log(
      "Error creating notifications table:",
      error.message
    );

  } finally {
    await pool.end();
  }
};


//Run migration
createNotificationsTable();