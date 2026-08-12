import pool from "../config/db.js";

// Create Category
async function createCategory(category) {
    const {
        category_name,
        description,
        status
    } = category;

    const query = `
        INSERT INTO categories
        (
            category_name,
            description,
            status
        )
        VALUES
        ($1, $2, $3)
        RETURNING *;
    `;

    const values = [
        category_name,
        description,
        status
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// Get All Categories
async function getAllCategories() {
    const result = await pool.query(
        "SELECT * FROM categories ORDER BY id DESC"
    );

    return result.rows;
}


// Get Category By ID
async function getCategoryById(id) {
    const result = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [id]
    );

    return result.rows[0];
}


// Update Category
async function updateCategory(id, category) {
    const {
        category_name,
        description,
        status
    } = category;

    const query = `
        UPDATE categories
        SET
            category_name = $1,
            description = $2,
            status = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
    `;

    const values = [
        category_name,
        description,
        status,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// Delete Category
async function deleteCategory(id) {
    const result = await pool.query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
}


export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};