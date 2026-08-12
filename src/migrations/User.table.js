import pool from "../config/db.js";

const createUserTable = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,

        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        full_name VARCHAR(200) NOT NULL,

        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),

        password VARCHAR(255) NOT NULL,

        designation VARCHAR(100),
        profile_image TEXT,

        role_id INT,
        status VARCHAR(20) DEFAULT 'Active',

        last_login TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE SET NULL
      );
    `);

    console.log("Users table created successfully.");
  } catch (error) {
    console.error("Error creating users table:", error.message);
  } finally {
    process.exit();
  }
};

createUserTable();