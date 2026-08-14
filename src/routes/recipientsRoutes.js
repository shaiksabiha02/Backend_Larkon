import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all recipients
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM recipients
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching recipients:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recipients"
    });
  }
});

export default router;