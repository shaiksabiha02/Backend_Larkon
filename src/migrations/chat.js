import pool from "../config/db.js";

export async function up() {

    await pool.query(`

    CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          full_name VARCHAR(200),
          username VARCHAR(100),
          email VARCHAR(150) UNIQUE,
          password VARCHAR(255),
          phone VARCHAR(20),
          profile_image VARCHAR(255),
          status VARCHAR(20) DEFAULT 'Active',
          last_seen TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) DEFAULT 'private',
        group_name VARCHAR(100),
        group_image VARCHAR(255),
        created_by INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversation_members (
        id SERIAL PRIMARY KEY,
        conversation_id INT REFERENCES conversations(id),
        user_id INT REFERENCES users(id),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INT REFERENCES conversations(id),
        sender_id INT REFERENCES users(id),
        message TEXT,
        message_type VARCHAR(20) DEFAULT 'text',
        attachment VARCHAR(255),
        is_read BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS message_reactions (
        id SERIAL PRIMARY KEY,
        message_id INT REFERENCES messages(id),
        user_id INT REFERENCES users(id),
        reaction VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        title VARCHAR(255),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        message_id INT REFERENCES messages(id),
        file_name VARCHAR(255),
        file_path VARCHAR(255),
        file_size VARCHAR(50),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    `);

    console.log("7 Team Chat Tables Created Successfully");
}

export async function down() {

    await pool.query(`

    DROP TABLE IF EXISTS
    attachments,
    notifications,
    message_reactions,
    messages,
    conversation_members,
    conversations,
    users
    CASCADE;

    `);

    console.log("Team Chat Tables Deleted Successfully");
}