import pool from "../config/db.js";

async function createCategoriesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Categories table created successfully");

    } catch (error) {
        console.error(
            "Error creating categories table:",
            error.message
        );

    } finally {
        process.exit();
    }
}

createCategoriesTable();
