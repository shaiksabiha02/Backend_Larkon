import pool from "../config/db.js";

const createUserRoleTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_role
          FOREIGN KEY (role_id)
          REFERENCES roles(id)
          ON DELETE CASCADE,

        CONSTRAINT unique_user_role
          UNIQUE (user_id, role_id)
      );
    `);

    console.log("User Roles table created successfully.");
  } catch (error) {
    console.error("Error creating User Roles table:", error.message);
  } finally {
    process.exit();
  }
};

createUserRoleTable();