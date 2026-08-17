import express from "express";
import pool from "../config/db.js";

const router = express.Router();
// =====================================================
// GET ALL INBOX EMAILS
// GET /api/inbox
// =====================================================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.id AS inbox_id,
        i.user_id,
        e.id AS email_id,
        e.sender_id,
        e.receiver_email,
        e.subject,
        e.body,
        e.is_read,
        e.is_starred,
        e.folder,
        e.attachment,
        e.sent_at
      FROM inbox i
      INNER JOIN emails e ON e.id = i.email_id
      ORDER BY e.id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching inbox:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inbox",
      error: error.message
    });
  }
});


// ADD EMAIL TO INBOX
// POST /api/inbox
router.post("/", async (req, res) => {
  try {
    const { email_id, user_id } = req.body;

    if (!email_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "email_id and user_id are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO inbox (email_id, user_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [email_id, user_id]
    );

    res.status(201).json({
      success: true,
      message: "Email added to inbox successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error adding email to inbox:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add email to inbox",
      error: error.message
    });
  }
});

export default router;