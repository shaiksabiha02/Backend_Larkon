import pool from "../config/db.js";

export async function seedCalendar() {
  try {
    console.log("🌱 Seeding Calendar Data...");

    // 1. CATEGORIES - Left side
    await pool.query(`
      INSERT INTO event_categories (name, color) VALUES
      ('Team Building Retreat', '#FF6B6B'),
      ('Product Launch', '#4ECDC4'),
      ('Marketing Meeting', '#45B7D1'),
      ('Client Call', '#96CEB4'),
      ('Design Review', '#FFD93D')
      ON CONFLICT DO NOTHING
    `);

    const user = await pool.query("SELECT id FROM users LIMIT 1");
    const userId = user.rows[0].id;
    const cats = await pool.query("SELECT id, name FROM event_categories");

    const getCatId = (name) => cats.rows.find(c => c.name === name).id;

    // 2. EVENTS - Calendar lo kanipinchadaniki
    await pool.query(`
      INSERT INTO calendar_events (title, description, start_time, end_time, category_id, user_id, location) VALUES
      ('Team Building Retreat Meeting', 'Monthly team meeting', '2025-08-05 10:00:00', '2025-08-05 11:00:00', $1, $2, 'Conference Room A'),
      ('Product Launch Strategy', 'Discuss launch plan', '2025-08-06 14:00:00', '2025-08-06 15:30:00', $3, $2, 'Zoom'),
      ('Marketing Sales Meeting', 'Q3 targets', '2025-08-07 11:00:00', '2025-08-07 12:00:00', $4, $2, 'Office'),
      ('Client Call Collaboration', 'With Client A', '2025-08-08 16:00:00', '2025-08-08 17:00:00', $5, $2, 'Google Meet'),
      ('UI/UX Design Review', 'Review new designs', '2025-08-12 10:00:00', '2025-08-12 11:30:00', $6, $2, 'Design Team'),
      ('Sprint Planning', 'Next sprint tasks', '2025-08-14 09:00:00', '2025-08-14 10:00:00', $3, $2, 'Room B'),
      ('Setup Github Repository', 'New project setup', '2025-08-18 15:00:00', '2025-08-18 16:00:00', $1, $2, 'Remote')
    `, [getCatId('Team Building Retreat'), userId, getCatId('Product Launch'), getCatId('Marketing Meeting'), getCatId('Client Call'), getCatId('Design Review')]);

    console.log("✅ Calendar Seeder Completed");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await pool.end();
  }
}

seedCalendar();