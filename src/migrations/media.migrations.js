import pool from "../config/db.js";

export async function up() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS media (
            id SERIAL PRIMARY KEY,
            file_name VARCHAR(255) NOT NULL,
            file_url TEXT NOT NULL,
            file_type VARCHAR(100) NOT NULL,
            file_size BIGINT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("✅ Media table created successfully");
}

export async function down() {
    await pool.query(`
        DROP TABLE IF EXISTS media;
    `);

    console.log("✅ Media table dropped successfully");
}