import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("connect", () => {
    console.log("✅ PostgreSQL connected");
});

pool.on("error", (error) => {
    console.error("❌ PostgreSQL pool error:", error.message);
});

export default pool;