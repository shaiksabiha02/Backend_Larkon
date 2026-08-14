import pool from "../config/db.js";
const createPermissionTable = async () => {
    try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        permission_name VARCHAR(100) NOT NULL UNIQUE,
        description  TEXT,
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);
        console.log("Permissions table created successfully.");
    } catch (error) {
        console.error("Error creating permissions table:", error.message);
    } finally {
        process.exit();
    }
};
createPermissionTable();
