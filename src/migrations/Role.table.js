import pool from "../config/db.js";
const createRoletable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS roles(
            id SERIAL PRIMARY KEY,
            role_name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            status VARCHAR(20) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `);
            console.log("Roles table created successfully.");
        }catch (error) {
            console.error("Error creating Roles table:", error.message);
        } finally {
            process.exit();
        }
        };
        createRoletable();