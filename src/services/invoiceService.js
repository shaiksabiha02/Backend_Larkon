import pool from "../config/db.js";

//1. Getting invoices
export async function getInvoices() {

    const summaryResult = await pool.query(`
        SELECT
            COUNT(*) AS total_invoice,
            COUNT(*) FILTER (
                WHERE o.payment_status = 'pending'
            ) AS pending_invoice,
            COUNT(*) FILTER (
                WHERE o.payment_status = 'completed'
            ) AS paid_invoice,
            COUNT(*) FILTER (
                WHERE o.payment_status IN ('failed', 'refunded')
            ) AS inactive_invoice
        FROM invoices i
        JOIN orders o
            ON i.orders_id = o.id;
    `);

    const invoicesResult = await pool.query(`
        SELECT
            i.id AS invoice_id,
            i.invoice_number,
            i.orders_id,

            CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
            u.email AS customer_email,
            u.phone AS customer_phone,

            o.created_at AS order_date,
            o.total_amount,
            o.payment_status,
            o.status AS order_status

        FROM invoices i

        JOIN orders o
            ON i.orders_id = o.id

        JOIN users u
            ON o.user_id = u.id

        ORDER BY i.id;
    `);

    return {
        summary: {
            totalInvoice: Number(summaryResult.rows[0].total_invoice),
            pendingInvoice: Number(summaryResult.rows[0].pending_invoice),
            paidInvoice: Number(summaryResult.rows[0].paid_invoice),
            inactiveInvoice: Number(summaryResult.rows[0].inactive_invoice)
        },

        invoices: invoicesResult.rows
    };
}

// 2. Getting invoice details by id
export async function getInvoiceById(id) {

    // Get invoice, order and customer information
    const invoiceResult = await pool.query(
        `
        SELECT
            i.id AS invoice_id,
            i.invoice_number,
            i.orders_id AS order_id,

            o.created_at AS order_date,
            o.total_amount AS order_total,
            o.payment_status,
            o.status AS order_status,
            o.shipping_address,

            u.id AS user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone

        FROM invoices i

        JOIN orders o
            ON i.orders_id = o.id

        JOIN users u
            ON o.user_id = u.id

        WHERE i.id = $1
        `,
        [id]
    );

    if (invoiceResult.rows.length === 0) {
        return null;
    }

    const invoice = invoiceResult.rows[0];

    // Get products belonging to the order
    const itemsResult = await pool.query(
        `
        SELECT
            oi.id,
            oi.product_id,
            p.product_name,
            p.size,
            oi.quantity,
            oi.price,

            COALESCE(d.discount, 0) AS discount,
            p.tax,

            (
                oi.price * oi.quantity
                - COALESCE(d.discount, 0) * oi.quantity
                + p.tax * oi.quantity
            ) AS total

        FROM order_items oi

        JOIN products p
            ON oi.product_id = p.id

        LEFT JOIN discounts d
            ON oi.product_id = d.product_id

        WHERE oi.order_id = $1

        ORDER BY oi.id
        `,
        [invoice.order_id]
    );

    // Calculate subtotal, discount and tax
    const summaryResult = await pool.query(
        `
        SELECT
            COALESCE(
                SUM(oi.price * oi.quantity),
                0
            ) AS subtotal,

            COALESCE(
                SUM(COALESCE(d.discount, 0) * oi.quantity),
                0
            ) AS discount,

            COALESCE(
                SUM(p.tax * oi.quantity),
                0
            ) AS tax

        FROM order_items oi

        JOIN products p
            ON oi.product_id = p.id

        LEFT JOIN discounts d
            ON oi.product_id = d.product_id

        WHERE oi.order_id = $1
        `,
        [invoice.order_id]
    );

    const summary = summaryResult.rows[0];

    return {
        invoice: {
            id: invoice.invoice_id,
            invoice_number: invoice.invoice_number,
            order_id: invoice.order_id,
            order_date: invoice.order_date,
            payment_status: invoice.payment_status,
            order_status: invoice.order_status,
            shipping_address: invoice.shipping_address
        },

        billing: {
            user_id: invoice.user_id,
            name: `${invoice.first_name} ${invoice.last_name}`,
            email: invoice.email,
            phone: invoice.phone
        },

        items: itemsResult.rows,

        summary: {
            subtotal: summary.subtotal,
            discount: summary.discount,
            tax: summary.tax,
            grand_total: invoice.order_total
        }
    };
}

//3. Send invoice email
export async function sendInvoiceEmail(id) {

    // Get invoice and customer email
    const invoiceResult = await pool.query(
        `
        SELECT
            i.id,
            i.invoice_number,
            u.email
        FROM invoices i

        JOIN orders o
            ON i.orders_id = o.id

        JOIN users u
            ON o.user_id = u.id

        WHERE i.id = $1
        `,
        [id]
    );

    // Invoice not found
    if (invoiceResult.rows.length === 0) {
        return null;
    }

    const invoice = invoiceResult.rows[0];

    // Simulate sending the email
    console.log(
        `Mock email sent to ${invoice.email} for invoice ${invoice.invoice_number}`
    );

    // Store email attempt in invoice_email_logs
    const logResult = await pool.query(
        `
        INSERT INTO invoice_email_logs
        (
            invoice_id,
            recipient_email,
            status
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            invoice_id,
            recipient_email,
            sent_at,
            status
        `,
        [
            invoice.id,
            invoice.email,
            "Sent"
        ]
    );

    return {
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        recipient_email: invoice.email,
        status: logResult.rows[0].status,
        sent_at: logResult.rows[0].sent_at
    };
}



// 4. Generate invoice PDF data
export async function generateInvoicePDF(id) {

    // Get invoice, order and customer information
    const invoiceResult = await pool.query(
        `
        SELECT
            i.id AS invoice_id,
            i.invoice_number,
            i.orders_id AS order_id,

            o.created_at AS order_date,
            o.payment_status,
            o.status AS order_status,
            o.shipping_address,

            u.first_name,
            u.last_name,
            u.email,
            u.phone

        FROM invoices i

        JOIN orders o
            ON i.orders_id = o.id

        JOIN users u
            ON o.user_id = u.id

        WHERE i.id = $1
        `,
        [id]
    );

    // Invoice not found
    if (invoiceResult.rows.length === 0) {
        return null;
    }

    const invoice = invoiceResult.rows[0];

    // Get products/items from the order
    const itemsResult = await pool.query(
        `
        SELECT
            oi.product_id,
            p.product_name,
            p.size,
            oi.quantity,
            oi.price,

            COALESCE(d.discount, 0) AS discount,
            p.tax,

            (
                oi.price * oi.quantity
                - COALESCE(d.discount, 0) * oi.quantity
                + p.tax * oi.quantity
            ) AS total

        FROM order_items oi

        JOIN products p
            ON oi.product_id = p.id

        LEFT JOIN discounts d
            ON oi.product_id = d.product_id

        WHERE oi.order_id = $1

        ORDER BY oi.id
        `,
        [invoice.order_id]
    );

    // Calculate invoice summary
    let subtotal = 0;
    let discount = 0;
    let tax = 0;

    for (const item of itemsResult.rows) {

        const price = Number(item.price);
        const quantity = Number(item.quantity);
        const itemDiscount = Number(item.discount);
        const itemTax = Number(item.tax);

        subtotal += price * quantity;
        discount += itemDiscount * quantity;
        tax += itemTax * quantity;
    }

    const total = subtotal - discount + tax;

    return {
        invoice,
        items: itemsResult.rows,

        summary: {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        }
    };
}