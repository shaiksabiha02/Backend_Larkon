import Pool from '../config/db.js';

// List Orders with status filters
export const listOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT o.*,u.full_name AS user_name FROM orders o JOIN users u on o.user_id=u.id ';
        let params = [];

        if (status) {
            query += ' WHERE status = $1';
            params.push(status);
        }

        const result = await Pool.query(query, params);
        res.status(200).json({ success: true, orders: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Order details by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orderResult = await Pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const itemsResult = await Pool.query(`
            SELECT oi.*, p.product_name as product_name 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `, [id]);

        res.status(200).json({ 
            success: true, 
            order: orderResult.rows[0], 
            items: itemsResult.rows 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await Pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Received orders view
export const getReceivedOrders = async (req, res) => {
    try {
        const result = await Pool.query("SELECT * FROM orders WHERE status = 'received'");
        res.status(200).json({ success: true, orders: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Pool.query(
            "UPDATE orders SET status = 'cancelled' WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order cancelled', order: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get invoice
export const getInvoice = async (req, res) => {
   try {
        const { id: orderId } = req.params; 
        const orderQuery = `
            SELECT 
                o.id AS order_id,
                o.user_id,
                o.total_amount,
                o.items AS total_items_count,
                o.status AS order_status,
                o.payment_status,
                o.shipping_address,
                o.created_at AS order_date,
                u.full_name AS customer_name,
                u.email AS customer_email,
                u.phone AS customer_phone
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = $1;
        `;
        const orderResult = await Pool.query(orderQuery, [orderId]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order / Invoice not found'
            });
        }

        const orderData = orderResult.rows[0];

        const itemsQuery = `
            SELECT 
                oi.id AS item_id,
                oi.product_id,
                p.product_name,
                p.image,
                oi.quantity,
                oi.price AS unit_price,
                oi.tax,
                (oi.quantity * oi.price) AS total_item_price
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1;
        `;
        const itemsResult = await Pool.query(itemsQuery, [orderId]);

        let subtotal = 0;
        let totalTax = 0;

        itemsResult.rows.forEach(item => {
            const itemTotal = Number(item.unit_price) * item.quantity;
            const itemTax = (itemTotal * Number(item.tax)) / 100;
            subtotal += itemTotal;
            totalTax += itemTax;
        });

        const invoice = {
            invoice_number: `INV-${String(orderData.order_id).padStart(6, '0')}`,
            order_id: orderData.order_id,
            order_date: orderData.order_date,
            customer: {
                user_id: orderData.user_id,
                name: orderData.customer_name,
                email: orderData.customer_email,
                phone: orderData.customer_phone,
                shipping_address: orderData.shipping_address
            },
            items: itemsResult.rows,
            summary: {
                subtotal: subtotal.toFixed(2),
                total_tax: totalTax.toFixed(2),
                final_total: Number(orderData.total_amount).toFixed(2),
                payment_status: orderData.payment_status,
                order_status: orderData.order_status
            }
        };

        return res.status(200).json({
            success: true,
            data: invoice
        }); 
}catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export default {
    listOrders,
    getOrderById,
    updateOrderStatus,
    getReceivedOrders,
    cancelOrder,
    getInvoice
};