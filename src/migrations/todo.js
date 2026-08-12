import pool from "../config/db.js";

export async function up() {

    await pool.query(`

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(20),
        profile_image VARCHAR(255),
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(150),
        description TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'Active',
        created_by INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Task Status table
    CREATE TABLE IF NOT EXISTS task_status (
        id SERIAL PRIMARY KEY,
        status_name VARCHAR(50)
    );

    -- Task Priority table
    CREATE TABLE IF NOT EXISTS task_priority (
        id SERIAL PRIMARY KEY,
        priority_name VARCHAR(50)
    );

    -- Task Progress table
    CREATE TABLE IF NOT EXISTS task_progress (
        id SERIAL PRIMARY KEY,
        progress_percentage INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tasks table
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        project_id INT REFERENCES projects(id),
        task_name VARCHAR(255),
        description TEXT,
        due_date DATE,
        priority_id INT REFERENCES task_priority(id),
        status_id INT REFERENCES task_status(id),
        progress_id INT REFERENCES task_progress(id),
        created_by INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
-- Task Notifications table
CREATE TABLE IF NOT EXISTS task_notifications (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id),
    user_id INT REFERENCES users(id),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    -- Task Assignees table
    CREATE TABLE IF NOT EXISTS task_assignees (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        user_id INT REFERENCES users(id),
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Task Attachments table
    CREATE TABLE IF NOT EXISTS task_attachments (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        file_name VARCHAR(255),
        file_path VARCHAR(255),
        file_size VARCHAR(50),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Task Comments table
    CREATE TABLE IF NOT EXISTS task_comments (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        user_id INT REFERENCES users(id),
        comment TEXT,
        commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Task Activity Logs table
    CREATE TABLE IF NOT EXISTS task_activity_logs (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        activity VARCHAR(255),
        user_id INT REFERENCES users(id),
        activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Task Checklists table
    CREATE TABLE IF NOT EXISTS task_checklists (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        checklist_item VARCHAR(255),
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP
    );

    -- Task Labels table
    CREATE TABLE IF NOT EXISTS task_labels (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        label_name VARCHAR(100),
        label_color VARCHAR(20)
    );

 

    -- Task Reminders table
    CREATE TABLE IF NOT EXISTS task_reminders (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        reminder_date TIMESTAMP,
        reminder_type VARCHAR(50)
    );

    -- Task History table
    CREATE TABLE IF NOT EXISTS task_history (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id),
        action VARCHAR(255),
        old_value TEXT,
        new_value TEXT,
        changed_by INT REFERENCES users(id),
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    `);

    console.log("15 Todo App Tables Created Successfully");
}

export async function down() {

    await pool.query(`

    DROP TABLE IF EXISTS
    task_history,
    task_reminders,
    task_labels,
    task_checklists,
    task_activity_logs,
    task_comments,
    task_attachments,
    task_assignees,
    tasks,
    task_notifications,
    task_progress,
    task_priority,
    task_status,
    projects,
    users
    CASCADE;

    `);

    console.log("Tables Deleted Successfully");
}