import dotenv from "dotenv";

dotenv.config();

import http from "http";
import app from "./src/app.js";
import pool from "./src/config/db.js";

const PORT = process.env.PORT || 5009;

const server = http.createServer(app);

const startServer = async () => {
    try {
        console.log("🔄 Connecting to PostgreSQL...");

        const result = await pool.query("SELECT NOW()");

        console.log("✅ PostgreSQL Database Connected Successfully");
        console.log("🕐 Database time:", result.rows[0].now);

        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Server Error:");
        console.error(error);

        process.exit(1);
    }
};

startServer();

process.on("SIGINT", async () => {
    console.log("🛑 Shutting down server...");

    await pool.end();

    server.close(() => {
        console.log("✅ HTTP Server stopped");
        process.exit(0);
    });
});