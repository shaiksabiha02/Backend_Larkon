import pool from "../config/db.js";

async function createAttributesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS attributes (
                id SERIAL PRIMARY KEY,
                attribute_name VARCHAR(100) NOT NULL,
                attribute_value VARCHAR(100) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Attributes table created successfully");

    } catch (error) {
        console.error(
            "Error creating attributes table:",
            error.message
        );

    } finally {
        process.exit();
    }
}

createAttributesTable();
