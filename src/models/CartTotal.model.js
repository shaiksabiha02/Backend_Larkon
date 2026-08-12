import pool from "../config/db.js";

export const getOrderTotal = async(orderId)=>{
    const query =
    `
    SELECT id,total_amount
    From orders
    WHERE id = $1;
    `;
    const result = await pool.query(query,[orderId]);
    return result.rows[0];
};