import pool from "../config/db.js";
import bcrypt from "bcryptjs";

async function seedEmails() {
  try {
    console.log("🌱 Seeding Email UI Data...");

    const hashedPassword = await bcrypt.hash("123456", 10);

    // 1. USERS
    await pool.query(
      `
      INSERT INTO users
      (first_name, last_name, full_name, username, email, password, status)
      VALUES
      ('Daniel', 'Oliver', 'Daniel Oliver', 'daniel', 'daniel@larkon.com', $1, 'active'),
      ('Jack', 'Walker', 'Jack Walker', 'jack', 'jack@larkon.com', $1, 'active'),
      ('Kathy', 'Curtis', 'Kathy Curtis', 'kathy', 'kathy@larkon.com', $1, 'active'),
      ('Admin', 'User', 'Admin User', 'admin', 'admin@larkon.com', $1, 'active')
      ON CONFLICT (email) DO NOTHING
      `,
      [hashedPassword]
    );

    console.log("✅ Users inserted");

    // 2. RECIPIENTS
    await pool.query(
      `
      INSERT INTO recipients (name, email)
      VALUES
      ('Medium', 'noreply@medium.com'),
      ('Twitter', 'notify@twitter.com'),
      ('Stock Exchange', 'alerts@stock.com'),
      ('Google Drive Team', 'drive@google.com'),
      ('Dribbble', 'hello@dribbble.com')
      ON CONFLICT (email) DO NOTHING
      `
    );

    console.log("✅ Recipients inserted");

    // 3. GET ADMIN USER
    const adminResult = await pool.query(
      `SELECT id FROM users WHERE email = 'admin@larkon.com'`
    );

    const adminId = adminResult.rows[0].id;

    // 4. EMAILS
    await pool.query(
      `
      INSERT INTO emails
      (
        sender_id,
        receiver_email,
        subject,
        body,
        folder,
        is_read,
        is_starred,
        sent_at
      )
      VALUES

      (
        $1,
        'notify@twitter.com',
        'Larkon: Daniel J. Oliver has sent you a direct message on Twitter',
        'Daniel J. Oliver - Hey bro! I have a Larkon, You have a...',
        'inbox',
        false,
        true,
        '2025-02-20 10:30:00'
      ),

      (
        $1,
        'jack@larkon.com',
        'Images',
        'Jack F. Walker - 4 new images attached',
        'inbox',
        false,
        false,
        '2025-02-21 09:15:00'
      ),

      (
        $1,
        'kathy@larkon.com',
        'Fiverr',
        'Kathy B. Curtis - Here is a great new service provider and we are making progress',
        'inbox',
        true,
        false,
        '2025-02-21 08:00:00'
      ),

      (
        $1,
        'noreply@medium.com',
        'The World''s Top Stories',
        'Medium - Our top pick for you on Medium this week',
        'inbox',
        false,
        true,
        '2025-02-20 11:00:00'
      ),

      (
        $1,
        'hello@dribbble.com',
        'Dribbble',
        'Dribbble - 12 new shots from people you follow',
        'inbox',
        false,
        false,
        '2025-02-19 14:20:00'
      ),

      (
        $1,
        'drive@google.com',
        'Meeting Reminder',
        'Google Calendar - Migrating our meeting',
        'inbox',
        false,
        true,
        '2025-02-22 16:00:00'
      ),

      (
        $1,
        'notify@twitter.com',
        'Task Assigned',
        'Asana - Task assigned: Build API website',
        'inbox',
        false,
        false,
        '2025-02-24 12:30:00'
      ),

      (
        $1,
        'daniel@larkon.com',
        'Re: Project Update',
        'Hi Daniel, sending you the latest update',
        'sent',
        true,
        false,
        '2025-02-20 15:00:00'
      ),

      (
  $1,
  'admin@larkon.com',
  'New Campaign',
  'Draft: Let''s start new marketing campaign',
  'draft',
  false,
  false,
  '2025-02-23 10:00:00'
),

      (
        $1,
        'alerts@stock.com',
        'Stock Alert',
        'Stock Exchange - 3 new items in your StockExchange inbox',
        'inbox',
        false,
        true,
        '2025-02-22 09:00:00'
      ),

      (
        $1,
        'noreply@medium.com',
        'Old Newsletter',
        'This is old newsletter',
        'trash',
        true,
        false,
        '2025-02-10 08:00:00'
      )
      `,
      [adminId]
    );

    console.log("✅ Emails inserted");

    // 5. LINK INBOX EMAILS
    const inboxEmails = await pool.query(
      `SELECT id FROM emails WHERE folder = 'inbox'`
    );

    for (const email of inboxEmails.rows) {
      await pool.query(
        `
        INSERT INTO inbox (user_id, email_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [adminId, email.id]
      );
    }

    console.log("✅ Inbox linked");

    console.log("");
    console.log("🎉 Email UI Sample Data Seeded Successfully!");
    console.log("📧 Login: admin@larkon.com");
    console.log("🔑 Password: 123456");

  } catch (error) {
    console.error("❌ Seeder Error:", error);
  } finally {
    await pool.end();
  }
}

seedEmails();