import pool from "../config/db.js";

// Create Discount
async function createDiscount(productID, discount) {
    const result = await pool.query(
        `INSERT INTO discounts(product_id, discount)
         VALUES($1, $2)
         RETURNING *;`,
        [productID, discount]
    );

    return result.rows[0];
}


// Edit Discount
async function editDiscount(productID, discount) {
    const result = await pool.query(
        `UPDATE discounts
         SET
            discount = $2,
            updated_at = CURRENT_TIMESTAMP
         WHERE product_id = $1
         RETURNING *;`,
        [productID, discount]
    );

    return result.rows[0];
}


// Get Discount
async function getDiscountByProductID(productID) {
    const result = await pool.query(
        `SELECT *
         FROM discounts
         WHERE product_id = $1;`,
        [productID]
    );

    return result.rows[0];
}


export {
    createDiscount,
    editDiscount,
    getDiscountByProductID
};