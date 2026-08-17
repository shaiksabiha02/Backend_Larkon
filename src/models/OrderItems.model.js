import pool from "../config/db.js";

export const getOrderItemsForCoupon = async(orderId)=>{
    const query =
    `
    SELECT 
    order_id,
    product_id,
    category_id
    FROM order_items
    WHERE order_id = $1;
    `;

    const result = await pool.query(query,[orderId]);
    return result.rows;
};