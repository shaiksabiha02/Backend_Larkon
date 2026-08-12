import pool from "../config/db.js";


// ========================================
// 1. Dashboard Summary
// ========================================

export const getDashboardSummary = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM orders) AS total_orders,
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COALESCE(SUM(total_amount), 0)
                 FROM orders) AS total_revenue
        `);

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard summary"
        });
    }
};


// ========================================
// 2. Recent Orders
// ========================================

export const getRecentOrders = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                o.id AS order_id,
                o.created_at,
                o.user_id,
                u.full_name,
                o.total_amount,
                o.priority,
                o.payment_status
            FROM orders o
            JOIN users u
                ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 10
        `);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Recent Orders Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch recent orders"
        });
    }
};


// ========================================
// 3. Sales Overview
// ========================================

export const getSalesOverview = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                DATE(created_at) AS date,
                COUNT(*) AS total_orders,
                COALESCE(SUM(total_amount), 0) AS total_revenue
            FROM orders
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Sales Overview Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch sales overview"
        });
    }
};


// ========================================
// 4. Top Products
// ========================================

export const getTopProducts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id AS product_id,
                p.product_name,
                SUM(oi.quantity) AS total_quantity,
                SUM(oi.quantity * oi.price) AS total_sales
            FROM order_items oi
            JOIN products p
                ON oi.product_id = p.id
            GROUP BY p.id, p.product_name
            ORDER BY total_sales DESC
            LIMIT 10
        `);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("❌ Top Products Database Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch top products"
        });
    }
};
// ========================================
// 5. Revenue By Category
// ========================================

export const getRevenueByCategory = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.id AS category_id,
                c.category_name,
                SUM(oi.quantity) AS total_quantity,
                SUM(oi.quantity * oi.price) AS total_sales
            FROM order_items oi
            JOIN products p
                ON oi.product_id = p.id
            JOIN categories c
                ON p.category_id = c.id
            GROUP BY c.id, c.category_name
            ORDER BY total_sales DESC
        `);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Revenue By Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch revenue by category"
        });
    }
};
// ========================================
// 5. Category-wise Sales
// ========================================

export const getCategorySales = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.id AS category_id,
                c.category_name,
                SUM(oi.quantity) AS total_quantity,
                SUM(oi.quantity * oi.price) AS total_sales
            FROM order_items oi
            JOIN products p
                ON oi.product_id = p.id
            JOIN categories c
                ON p.category_id = c.id
            GROUP BY c.id, c.category_name
            ORDER BY total_sales DESC
        `);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("❌ Category Sales Database Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch category sales"
        });
    }
};
// ========================================
// 6. Customer Growth
// ========================================

export const getCustomerGrowth = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                DATE(o.created_at) AS date,
                COUNT(DISTINCT o.user_id) AS total_customers,
                COUNT(DISTINCT CASE
                    WHEN first_order.first_order_date = DATE(o.created_at)
                    THEN o.user_id
                END) AS new_customers,
                COUNT(DISTINCT CASE
                    WHEN first_order.first_order_date < DATE(o.created_at)
                    THEN o.user_id
                END) AS returning_customers
            FROM orders o
            JOIN (
                SELECT
                    user_id,
                    MIN(DATE(created_at)) AS first_order_date
                FROM orders
                GROUP BY user_id
            ) first_order
                ON o.user_id = first_order.user_id
            GROUP BY DATE(o.created_at)
            ORDER BY DATE(o.created_at) ASC
        `);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Customer Growth Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer growth"
        });
    }
};