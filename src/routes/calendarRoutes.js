import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* =========================================================
   GET ALL CALENDAR EVENTS
   ========================================================= */
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
        e.created_at,

        COALESCE(
          json_agg(
            json_build_object(
              'user_id', u.id,
              'first_name', u.first_name,
              'last_name', u.last_name,
              'email', u.email
            )
          ) FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) AS attendees

      FROM events e

      LEFT JOIN event_attendees ea
        ON e.id = ea.event_id

      LEFT JOIN users u
        ON ea.user_id = u.id

      GROUP BY
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.event_type,
        e.color,
        e.created_by,
        e.created_at

      ORDER BY e.start_time ASC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching calendar events:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch calendar events",
      error: error.message
    });
  }
});


/* =========================================================
   GET SINGLE CALENDAR EVENT
   ========================================================= */
router.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

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
        e.created_at,

        COALESCE(
          json_agg(
            json_build_object(
              'user_id', u.id,
              'first_name', u.first_name,
              'last_name', u.last_name,
              'email', u.email
            )
          ) FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) AS attendees

      FROM events e

      LEFT JOIN event_attendees ea
        ON e.id = ea.event_id

      LEFT JOIN users u
        ON ea.user_id = u.id

      WHERE e.id = $1

      GROUP BY
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.event_type,
        e.color,
        e.created_by,
        e.created_at
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Calendar event not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error fetching calendar event:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch calendar event",
      error: error.message
    });
  }
});


/* =========================================================
   CREATE NEW CALENDAR EVENT
   ========================================================= */
router.post("/events", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      description,
      start_time,
      end_time,
      event_type,
      color,
      created_by,
      attendees
    } = req.body;

    if (!title || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "title, start_time and end_time are required"
      });
    }

    await client.query("BEGIN");

    const eventResult = await client.query(`
      INSERT INTO events
      (
        title,
        description,
        start_time,
        end_time,
        event_type,
        color,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      title,
      description || null,
      start_time,
      end_time,
      event_type || null,
      color || null,
      created_by || null
    ]);

    const event = eventResult.rows[0];

    /* Add unique attendees */
    if (Array.isArray(attendees)) {
      const uniqueAttendees = [...new Set(attendees)];

      for (const userId of uniqueAttendees) {
        await client.query(`
          INSERT INTO event_attendees
          (
            event_id,
            user_id
          )
          VALUES ($1, $2)
        `, [event.id, userId]);
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Calendar event created successfully",
      data: event
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Error creating calendar event:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create calendar event",
      error: error.message
    });

  } finally {
    client.release();
  }
});


/* =========================================================
   UPDATE CALENDAR EVENT
   ========================================================= */
router.put("/events/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      title,
      description,
      start_time,
      end_time,
      event_type,
      color,
      created_by,
      attendees
    } = req.body;

    await client.query("BEGIN");

    const eventResult = await client.query(`
      UPDATE events
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        start_time = COALESCE($3, start_time),
        end_time = COALESCE($4, end_time),
        event_type = COALESCE($5, event_type),
        color = COALESCE($6, color),
        created_by = COALESCE($7, created_by)
      WHERE id = $8
      RETURNING *
    `, [
      title,
      description,
      start_time,
      end_time,
      event_type,
      color,
      created_by,
      id
    ]);

    if (eventResult.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Calendar event not found"
      });
    }

    /* Replace attendees */
    if (Array.isArray(attendees)) {

      await client.query(`
        DELETE FROM event_attendees
        WHERE event_id = $1
      `, [id]);

      const uniqueAttendees = [...new Set(attendees)];

      for (const userId of uniqueAttendees) {
        await client.query(`
          INSERT INTO event_attendees
          (
            event_id,
            user_id
          )
          VALUES ($1, $2)
        `, [id, userId]);
      }
    }

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Calendar event updated successfully",
      data: eventResult.rows[0]
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Error updating calendar event:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update calendar event",
      error: error.message
    });

  } finally {
    client.release();
  }
});


/* =========================================================
   DELETE CALENDAR EVENT
   ========================================================= */
router.delete("/events/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    /* Delete attendees first */
    await client.query(`
      DELETE FROM event_attendees
      WHERE event_id = $1
    `, [id]);

    /* Delete event */
    const result = await client.query(`
      DELETE FROM events
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Calendar event not found"
      });
    }

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Calendar event deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Error deleting calendar event:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete calendar event",
      error: error.message
    });

  } finally {
    client.release();
  }
});


/* =========================================================
   GET EVENT CATEGORIES
   ========================================================= */
router.get("/categories", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT *
      FROM event_categories
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {

    console.error("Error fetching event categories:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event categories",
      error: error.message
    });
  }
});


/* =========================================================
   CREATE EVENT CATEGORY
   ========================================================= */
router.post("/categories", async (req, res) => {
  try {

    const {
      name,
      color
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const result = await pool.query(`
      INSERT INTO event_categories
      (
        name,
        color
      )
      VALUES ($1, $2)
      RETURNING *
    `, [
      name,
      color || null
    ]);

    res.status(201).json({
      success: true,
      message: "Event category created successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.error("Error creating event category:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create event category",
      error: error.message
    });
  }
});


/* =========================================================
   DELETE EVENT CATEGORY
   ========================================================= */
router.delete("/categories/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM event_categories
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Event category deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.error("Error deleting event category:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete event category",
      error: error.message
    });
  }
});


/* =========================================================
   EXPORT ROUTER
   ========================================================= */
export default router;