import pool from "../config/db.js";

export const globalSearch = async (req, res) => {
    try {
        const { q } = req.query;

        // ========================================
        // Validate Search Query
        // ========================================

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const searchTerm = `%${q.trim()}%`;

        // ========================================
        // 1. Search Products
        // ========================================

        const productsResult = await pool.query(
            `
            SELECT
                p.id AS product_id,
                p.product_name,
                p.brand,
                p.price,
                p.stock,
                p.status
            FROM products p
            WHERE
                p.product_name ILIKE $1
                OR p.brand ILIKE $1
            ORDER BY p.id DESC
            LIMIT 20
            `,
            [searchTerm]
        );

        // ========================================
        // 2. Search Customers
        // ========================================

        const customersResult = await pool.query(
            `
            SELECT
                u.id AS user_id,
                u.full_name,
                u.email,
                u.phone,
                u.status
            FROM users u
            WHERE
                u.full_name ILIKE $1
                OR u.email ILIKE $1
                OR u.phone ILIKE $1
            ORDER BY u.id DESC
            LIMIT 20
            `,
            [searchTerm]
        );

        // ========================================
        // 3. Search Orders
        // ========================================

        const ordersResult = await pool.query(
            `
            SELECT
                o.id AS order_id,
                o.user_id,
                u.full_name,
                o.total_amount,
                o.payment_status,
                o.status,
                o.delivery_number,
                o.created_at
            FROM orders o
            LEFT JOIN users u
                ON o.user_id = u.id
            WHERE
                CAST(o.id AS TEXT) ILIKE $1
                OR u.full_name ILIKE $1
                OR u.email ILIKE $1
                OR o.delivery_number ILIKE $1
            ORDER BY o.created_at DESC
            LIMIT 20
            `,
            [searchTerm]
        );

        // ========================================
        // Success Response
        // ========================================

        res.status(200).json({
            success: true,
            data: {
                products: productsResult.rows,
                customers: customersResult.rows,
                orders: ordersResult.rows
            }
        });

    } catch (error) {

        // ========================================
        // Debug Error
        // ========================================

        console.error("🔥 Global Search Error:");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Hint:", error.hint);

        res.status(500).json({
            success: false,
            message: "Failed to perform search",
            error: error.message
        });
    }
};