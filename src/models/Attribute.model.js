import pool from "../config/db.js";

// Create Attribute
async function createAttribute(attribute) {
    const {
        attribute_name,
        attribute_value
    } = attribute;

    const query = `
        INSERT INTO attributes
        (
            attribute_name,
            attribute_value
        )
        VALUES
        ($1, $2)
        RETURNING *;
    `;

    const values = [
        attribute_name,
        attribute_value
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// Get All Attributes
async function getAllAttributes() {
    const result = await pool.query(
        "SELECT * FROM attributes ORDER BY id DESC"
    );

    return result.rows;
}


// Get Attribute By ID
async function getAttributeById(id) {
    const result = await pool.query(
        "SELECT * FROM attributes WHERE id = $1",
        [id]
    );

    return result.rows[0];
}


// Update Attribute
async function updateAttribute(id, attribute) {
    const {
        attribute_name,
        attribute_value
    } = attribute;

    const query = `
        UPDATE attributes
        SET
            attribute_name = $1,
            attribute_value = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *;
    `;

    const values = [
        attribute_name,
        attribute_value,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// Delete Attribute
async function deleteAttribute(id) {
    const result = await pool.query(
        "DELETE FROM attributes WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
}


export {
    createAttribute,
    getAllAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute
};