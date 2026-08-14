import pool from "../config/db.js";

const createUserProfileTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        full_name VARCHAR(200) NOT NULL,
        designation VARCHAR(100),
        profile_image TEXT,
        address TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    console.log("User Profiles table created successfully.");
  } catch (error) {
    console.error("Error creating User Profiles table:", error.message);
  } finally {
    process.exit();
  }
};

createUserProfileTable();