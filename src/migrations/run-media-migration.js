import pool from "../config/db.js";
import { up } from "./media.migrations.js";

async function runMigration() {
    try {
        console.log("Starting media migration...");

        await up();

        console.log("✅ Media table created successfully!");
    } catch (error) {
        console.error("❌ Media migration failed:");
        console.error(error);
    } finally {
        await pool.end();
    }
}

runMigration();