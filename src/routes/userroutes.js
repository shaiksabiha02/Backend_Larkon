import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM users
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
});

export default router;