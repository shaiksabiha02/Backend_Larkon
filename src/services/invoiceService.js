import pool from "../config/db.js";

// 1. Get all invoices
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


// 2. Get invoice details
export async function getInvoiceById(id) {
    const invoiceResult = await pool.query(
        `
        SELECT
            i.id AS invoice_id,
            i.invoice_number,
            i.orders_id AS order_id,

            o.created_at AS order_date,
            o.total_amount,
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

    const itemsResult = await pool.query(
        `
        SELECT
            oi.id AS order_item_id,
            oi.product_id,
            p.product_name,
            p.size,
            oi.quantity,
            oi.price,
            COALESCE(oi.tax, 0) AS tax

        FROM order_items oi
        JOIN products p
            ON oi.product_id = p.id

        WHERE oi.order_id = $1

        ORDER BY oi.id
        `,
        [invoice.order_id]
    );

    let subtotal = 0;
    let tax = 0;

    const items = itemsResult.rows.map(item => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const itemTax = Number(item.tax) || 0;

        const itemSubtotal = price * quantity;
        const totalTax = itemTax * quantity;
        const itemTotal = itemSubtotal + totalTax;

        subtotal += itemSubtotal;
        tax += totalTax;

        return {
            id: item.order_item_id,
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            quantity,
            price: price.toFixed(2),
            tax: itemTax.toFixed(2),
            total: itemTotal.toFixed(2)
        };
    });

    const grandTotal = Number(invoice.total_amount) || 0;

    const discount = Math.max(
        0,
        subtotal + tax - grandTotal
    );

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
            name: `${invoice.first_name || ""} ${invoice.last_name || ""}`.trim(),
            email: invoice.email,
            phone: invoice.phone
        },

        items,

        summary: {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            grand_total: grandTotal.toFixed(2)
        }
    };
}


// 3. Send invoice email
export async function sendInvoiceEmail(id) {
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

    if (invoiceResult.rows.length === 0) {
        return null;
    }

    const invoice = invoiceResult.rows[0];

    console.log(
        `Mock email sent to ${invoice.email} for invoice ${invoice.invoice_number}`
    );

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
    const invoiceResult = await pool.query(
        `
        SELECT
            i.id AS invoice_id,
            i.invoice_number,
            i.orders_id AS order_id,

            o.created_at AS order_date,
            o.total_amount,
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

    const itemsResult = await pool.query(
        `
        SELECT
            oi.id AS order_item_id,
            oi.product_id,
            p.product_name,
            p.size,
            oi.quantity,
            oi.price,
            COALESCE(oi.tax, 0) AS tax

        FROM order_items oi
        JOIN products p
            ON oi.product_id = p.id

        WHERE oi.order_id = $1

        ORDER BY oi.id
        `,
        [invoice.order_id]
    );

    let subtotal = 0;
    let tax = 0;

    const items = itemsResult.rows.map(item => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const itemTax = Number(item.tax) || 0;

        const itemSubtotal = price * quantity;
        const totalTax = itemTax * quantity;
        const itemTotal = itemSubtotal + totalTax;

        subtotal += itemSubtotal;
        tax += totalTax;

        return {
            id: item.order_item_id,
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            quantity,
            price: price.toFixed(2),
            tax: itemTax.toFixed(2),
            subtotal: itemSubtotal.toFixed(2),
            item_tax: totalTax.toFixed(2),
            total: itemTotal.toFixed(2)
        };
    });

    const grandTotal = Number(invoice.total_amount) || 0;

    const discount = Math.max(
        0,
        subtotal + tax - grandTotal
    );

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
            name: `${invoice.first_name || ""} ${invoice.last_name || ""}`.trim(),
            email: invoice.email,
            phone: invoice.phone
        },

        items,

        summary: {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            grand_total: grandTotal.toFixed(2)
        }
    };
}