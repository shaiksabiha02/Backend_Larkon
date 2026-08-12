import pool from "../config/db.js";

const createRefreshTokenTable = async () => {
  try {
    // Drop existing table
    await pool.query(`
      DROP TABLE IF EXISTS refresh_tokens CASCADE;
    `);

    // Create table again
    await pool.query(`
      CREATE TABLE refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_refresh_token_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    console.log("Refresh Tokens table recreated successfully.");

  } catch (error) {
    console.error(
      "Error recreating Refresh Tokens table:",
      error.message
    );

  } finally {
    process.exit();
  }
};

createRefreshTokenTable();