import pool from "../config/db.js";

// Create Discount 

export const createDiscount = async (productID, discount) =>{
    const result = await pool.query(
        `INSERT into discounts(product_id,discount)
         Values($1,$2)
         RETURNING *;
        `,
        [productID,discount]
    );
    return result.rows[0];
}

// Edit Discount

export const EditDiscount = async (productID,discount)=>{
    const result = await pool.query(
        `Update discounts
        SET 
           discount = $2,
           updated_at = CURRENT_TIMESTAMPTZ
           where product_id = $1
           RETURNING *;`,
           [productID,discount]

    );
    return result.rows[0];
}

// Get Discounts

export const getDiscountByProductID = async (productID)=>{
    const result = await pool.query(
        `
        SELECT *
        FROm discounts
        WHERE product_id = $1;
        `,
        [productID]
    );
    return result.rows[0];
};