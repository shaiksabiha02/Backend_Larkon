import pool from "../config/db.js";
import bcrypt from "bcrypt";

// GET General Settings
export async function getGeneralSettings() {
    try {
        const result = await pool.query(`
            SELECT *
            FROM general_settings
            LIMIT 1
        `);
        return result.rows[0];

    } catch (error) {
        console.error("Failed to fetch general settings:", error);
        throw error;
    }
}

// PUT General Settings
export async function updateGeneralSettings(data) {
    try {

        const {
            meta_title,
            meta_keywords,
            store_theme,
            layout,
            meta_description
        } = data;

        const result = await pool.query(
            `
            UPDATE general_settings
            SET
                meta_title = $1,
                meta_keywords = $2,
                store_theme = $3,
                layout = $4,
                meta_description = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
            RETURNING *;
            `,
            [
                meta_title,
                meta_keywords,
                store_theme,
                layout,
                meta_description
            ]
        );

        return result.rows[0];
        
    } catch (error) {
        console.error("Failed to update general settings:", error);
        throw error;
    }
}

//GET Admin Profile
export async function getAdminProfile(userId) {
    const result = await pool.query(
        `
        SELECT
            id,
            first_name,
            last_name,
            full_name,
            username,
            email,
            phone,
            designation,
            profile_image,
            status
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


//updating Admin profile
export async function updateAdminProfile(userId, data) {
    const {
        first_name,
        last_name,
        full_name,
        username,
        email,
        phone
    } = data;

    const result = await pool.query(
        `
        UPDATE users
        SET
            first_name = $1,
            last_name = $2,
            full_name = $3,
            username = $4,
            email = $5,
            phone = $6
        WHERE id = $7
        RETURNING
            id,
            first_name,
            last_name,
            full_name,
            username,
            email,
            phone,
            designation,
            status
        `,
        [
            first_name,
            last_name,
            full_name,
            username,
            email,
            phone,
            userId
        ]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

// Changing admin password
export async function changeAdminPassword(userId, currentPassword, newPassword) {

    // 1. Get the existing hashed password
    const userResult = await pool.query(
        `
        SELECT password
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    if (userResult.rows.length === 0) {
        return {
            success: false,
            type: "not_found"
        };
    }

    const storedPassword = userResult.rows[0].password;

    // 2. Check current password
    const isMatch = await bcrypt.compare(
        currentPassword,
        storedPassword
    );

    if (!isMatch) {
        return {
            success: false,
            type: "invalid_password"
        };
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password
    await pool.query(
        `
        UPDATE users
        SET password = $1
        WHERE id = $2
        `,
        [hashedPassword, userId]
    );

    return {
        success: true
    };
}