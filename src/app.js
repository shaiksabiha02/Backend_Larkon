import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboard.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import searchRoutes from "./routes/search.routes.js";


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// ========================================
// Static Uploads
// ========================================

app.use("/uploads", express.static("uploads"));

// ========================================
// Dashboard Routes
// ========================================

app.use("/api/v1/dashboard", dashboardRoutes);

// ========================================
// Search Routes
// ========================================

app.use("/api/v1/search", searchRoutes);

// ========================================
// Media Routes
// ========================================

app.use("/api/v1/media", mediaRoutes);

// ========================================
// Home Route
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "Backend server is running"
    });
});

// ========================================
// Global Error Handler
// ========================================

app.use((err, req, res, next) => {
    console.error("🔥 GLOBAL ERROR:");
    console.error(err);

    console.error("Message:", err?.message);
    console.error("Code:", err?.code);
    console.error("Name:", err?.name);

    res.status(500).json({
        success: false,
        message: err?.message || "Something went wrong",
        error: err
    });
});

export default app;