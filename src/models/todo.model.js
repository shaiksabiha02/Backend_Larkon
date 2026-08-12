import pool from "../config/db.js";

// ======================
    // GET ALL TASKS
// ======================

export const fetchTasks = async (limit = 10, offset = 0) => {

    // Get paginated tasks
    const result = await pool.query(
        `
        SELECT

            t.id,
            t.task_name,
            p.project_name,
            t.description,
            t.due_date,
            tp.priority_name,
            ts.status_name,
            pg.progress_percentage,
            u.first_name || ' ' || u.last_name AS assignee_name,
            u.profile_image

        FROM tasks t

        LEFT JOIN projects p
        ON t.project_id = p.id

        LEFT JOIN task_priority tp
        ON t.priority_id = tp.id

        LEFT JOIN task_status ts
        ON t.status_id = ts.id

        LEFT JOIN task_progress pg
        ON t.progress_id = pg.id

        LEFT JOIN task_assignees ta
        ON ta.task_id = t.id

        LEFT JOIN users u
        ON ta.user_id = u.id

        ORDER BY t.id

        LIMIT $1
        OFFSET $2;
        `,
        [limit, offset]
    );


// Get total number of tasks
    const countResult = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM tasks;
        `
    );

    const total = parseInt(countResult.rows[0].total);

    return {
        tasks: result.rows,
        total: total
    };
};

// ======================
     // GET TODO BY ID
// ======================

export const fetchTodoById = async (id) => {

    const result = await pool.query(
        `
        SELECT
            t.id,
            t.task_name,
            t.description,
            t.due_date,
            p.project_name,
            ts.status_name,
            tp.priority_name,
            pg.progress_percentage,
            u.first_name || ' ' || u.last_name AS assignee_name,
            u.profile_image
        FROM tasks t

        LEFT JOIN projects p
            ON t.project_id = p.id

        LEFT JOIN task_status ts
            ON t.status_id = ts.id

        LEFT JOIN task_priority tp
            ON t.priority_id = tp.id

        LEFT JOIN task_progress pg
            ON t.progress_id = pg.id

        LEFT JOIN task_assignees ta
            ON ta.task_id = t.id

        LEFT JOIN users u
            ON ta.user_id = u.id

        WHERE t.id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

// ======================
      // CREATE TASK
// ======================

export const createTask = async (data) => {
    console.log("MODEL DATA:", data);

    const {
        project_id,
        task_name,
        description,
        due_date,
        priority_id,
        status_id,
        progress_id,
        created_by
    } = data;

    const result = await pool.query(

        `INSERT INTO tasks
        (
            project_id,
            task_name,
            description,
            due_date,
            priority_id,
            status_id,
            progress_id,
            created_by
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)

        RETURNING *;`,

        [
            project_id,
            task_name,
            description,
            due_date,
            priority_id,
            status_id,
            progress_id,
            created_by
        ]

    );

    return result.rows[0];

};

// ======================
    // UPDATE TASK
// ======================

export const updateTask = async (id, data) => {

    const {
        task_name,
        description,
        due_date,
        priority_id,
        status_id,
        progress_id
    } = data;

    const result = await pool.query(

        `UPDATE tasks

        SET

        task_name=$1,

        description=$2,

        due_date=$3,

        priority_id=$4,

        status_id=$5,

        progress_id=$6,

        updated_at=NOW()

        WHERE id=$7

        RETURNING *;`,

        [
            task_name,
            description,
            due_date,
            priority_id,
            status_id,
            progress_id,
            id
        ]

    );

    return result.rows[0];

};

// ======================
      // DELETE TASK
// ======================

export const deleteTask = async (id) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Delete child records first
        await client.query(
            `DELETE FROM task_assignees WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_comments WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_labels WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_notifications WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_activity_logs WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_history WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_attachments WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_checklists WHERE task_id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM task_reminders WHERE task_id = $1`,
            [id]
        );

 // Finally delete task
        const result = await client.query(
            `DELETE FROM tasks WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error("Task not found");
        }

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
};