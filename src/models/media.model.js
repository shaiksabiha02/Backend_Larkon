import pool from "../config/db.js";

// ========================================
// Create Media
// ========================================

export const createMedia = async ({
    fileName,
    fileUrl,
    fileType,
    fileSize
}) => {

    const result = await pool.query(
        `
        INSERT INTO media
        (
            file_name,
            file_url,
            file_type,
            file_size
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            fileName,
            fileUrl,
            fileType,
            fileSize
        ]
    );

    return result.rows[0];
};


// ========================================
// Get Media By ID
// ========================================

export const findMediaById = async (id) => {

    const result = await pool.query(
        `
        SELECT *
        FROM media
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};


// ========================================
// Get All Media
// ========================================

export const findAllMedia = async () => {

    const result = await pool.query(
        `
        SELECT *
        FROM media
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};


// ========================================
// Delete Media
// ========================================

export const deleteMedia = async (id) => {

    const result = await pool.query(
        `
        DELETE FROM media
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};