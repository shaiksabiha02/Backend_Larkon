import pool from "../config/db.js";

export const getDashboardSummary = async () => {

    const result = await pool.query(`
        SELECT
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_amount), 0) AS total_revenue
        FROM orders
    `);

    return result.rows[0];
};