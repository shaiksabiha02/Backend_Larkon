import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET ALL EMAIL LABELS
// GET /api/email-labels
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM email_labels
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching email labels:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch email labels",
      error: error.message
    });
  }
});


// CREATE EMAIL LABEL
// POST /api/email-labels
router.post("/", async (req, res) => {
  try {
    const { email_id, label_name } = req.body;

    if (!email_id || !label_name) {
      return res.status(400).json({
        success: false,
        message: "email_id and label_name are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO email_labels
      (email_id, label_name)
      VALUES ($1, $2)
      RETURNING *
      `,
      [email_id, label_name]
    );

    res.status(201).json({
      success: true,
      message: "Email label created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating email label:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create email label",
      error: error.message
    });
  }
});

export default router;