import express from "express";
import pool from "../config/db.js";

const router = express.Router();


// =====================================================
// GET ALL EMAILS
// GET /api/emails
// =====================================================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM emails
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching emails:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch emails",
      error: error.message
    });
  }
});


// =====================================================
// GET SINGLE EMAIL BY ID
// GET /api/emails/:id
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email ID"
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM emails
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error fetching email:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch email",
      error: error.message
    });
  }
});


// =====================================================
// CREATE / SEND EMAIL
// POST /api/emails
// =====================================================
router.post("/", async (req, res) => {
  try {
    const {
      sender_id,
      receiver_email,
      subject,
      body,
      is_read = false,
      is_starred = false,
      folder = "Sent",
      attachment = null
    } = req.body;

    // Required fields
    if (!sender_id || !receiver_email || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "sender_id, receiver_email, subject and body are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO emails
      (
        sender_id,
        receiver_email,
        subject,
        body,
        is_read,
        is_starred,
        folder,
        attachment,
        sent_at
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
      `,
      [
        sender_id,
        receiver_email,
        subject,
        body,
        is_read,
        is_starred,
        folder,
        attachment
      ]
    );

    res.status(201).json({
      success: true,
      message: "Email sent successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message
    });
  }
});

// =====================================================
// UPDATE EMAIL
// PATCH /api/emails/:id
// =====================================================
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email ID"
      });
    }

    const {
      receiver_email,
      subject,
      body,
      is_read,
      is_starred,
      folder,
      attachment
    } = req.body;

    const result = await pool.query(
      `
      UPDATE emails
      SET
        receiver_email = COALESCE($1, receiver_email),
        subject = COALESCE($2, subject),
        body = COALESCE($3, body),
        is_read = COALESCE($4, is_read),
        is_starred = COALESCE($5, is_starred),
        folder = COALESCE($6, folder),
        attachment = COALESCE($7, attachment)
      WHERE id = $8
      RETURNING *
      `,
      [
        receiver_email,
        subject,
        body,
        is_read,
        is_starred,
        folder,
        attachment,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating email:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update email",
      error: error.message
    });
  }
});


// =====================================================
// DELETE EMAIL
// DELETE /api/emails/:id
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email ID"
      });
    }

    const result = await pool.query(
      `
      DELETE FROM emails
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Email deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error deleting email:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete email",
      error: error.message
    });
  }
});
export default router;