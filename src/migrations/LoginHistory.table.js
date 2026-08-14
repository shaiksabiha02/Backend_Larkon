import pool from "../config/db.js";

const createLoginHistoryTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_history (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        ip_address VARCHAR(100),
        device VARCHAR(255),
        browser VARCHAR(255),
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        logout_time TIMESTAMP,
        status VARCHAR(20) DEFAULT 'Success',

        CONSTRAINT fk_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    console.log("Login History table created successfully.");
  } catch (error) {
    console.error("Error creating Login History table:", error.message);
  } finally {
    process.exit();
  }
};

createLoginHistoryTable();