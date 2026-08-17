import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET all calendar events
router.get("/events", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.event_type,
        e.color,
        e.created_by,
        e.created_at
      FROM calendar_events e
      ORDER BY e.start_time ASC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching events:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message
    });
  }
});


// POST create calendar event
router.post("/events", async (req, res) => {
  try {
    const {
      title,
      description,
      start_time,
      end_time,
      event_type,
      color,
      created_by
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO calendar_events
      (title, description, start_time, end_time, event_type, color, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        title,
        description,
        start_time,
        end_time,
        event_type,
        color,
        created_by
      ]
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating event:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message
    });
  }
});

export default router;