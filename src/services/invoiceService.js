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


    // Get order items
    // Tax is taken from order_items.tax
    const itemsResult = await pool.query(
        `
        SELECT
            oi.id AS order_item_id,
            oi.product_id,
            p.product_name,
            p.size,
            oi.quantity,
            oi.price,
            oi.tax

        FROM order_items oi
        JOIN products p
            ON oi.product_id = p.id

        WHERE oi.order_id = $1

        ORDER BY oi.id
        `,
        [invoice.order_id]
    );


    // Calculate subtotal and tax
    let subtotal = 0;
    let tax = 0;

    for (const item of itemsResult.rows) {
        const itemSubtotal =
            Number(item.price) * Number(item.quantity);

        const itemTax =
            Number(item.tax) * Number(item.quantity);

        subtotal += itemSubtotal;
        tax += itemTax;
    }


    // Find active coupon
    const couponResult = await pool.query(
        `
        SELECT DISTINCT
            c.id,
            c.coupon_code,
            c.coupon_type,
            c.discount_value,
            c.minimum_order_amount,
            c.maximum_discount_amount

        FROM coupons c
        JOIN coupon_products cp
            ON c.id = cp.coupon_id
        JOIN order_items oi
            ON cp.product_id = oi.product_id

        WHERE oi.order_id = $1
          AND c.status = 'Active'
          AND c.start_date <= CURRENT_TIMESTAMP
          AND c.end_date >= CURRENT_TIMESTAMP
          AND (
              c.usage_limit IS NULL
              OR c.used_count < c.usage_limit
          )

        ORDER BY c.id
        LIMIT 1
        `,
        [invoice.order_id]
    );


    let discount = 0;
    let appliedCoupon = null;


    // Calculate coupon discount
    if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];

        const minimumOrderAmount =
            Number(coupon.minimum_order_amount || 0);

        // Coupon applies only if minimum order amount is reached
        if (subtotal >= minimumOrderAmount) {

            // Percentage coupon
            if (coupon.coupon_type === "percentage") {
                discount =
                    subtotal *
                    (Number(coupon.discount_value) / 100);
            }

            // Fixed coupon
            else if (coupon.coupon_type === "fixed") {
                discount =
                    Number(coupon.discount_value);
            }


            // Apply maximum discount limit
            if (
                coupon.maximum_discount_amount !== null &&
                discount >
                    Number(coupon.maximum_discount_amount)
            ) {
                discount =
                    Number(coupon.maximum_discount_amount);
            }


            // Discount cannot exceed subtotal
            if (discount > subtotal) {
                discount = subtotal;
            }


            appliedCoupon = {
                coupon_code: coupon.coupon_code,
                coupon_type: coupon.coupon_type,
                discount_value: Number(
                    coupon.discount_value
                ).toFixed(2)
            };
        }
    }


    // Prepare invoice items
    const items = itemsResult.rows.map(item => {

        const itemSubtotal =
            Number(item.price) * Number(item.quantity);

        const itemTax =
            Number(item.tax) * Number(item.quantity);

        // Item total before invoice-level coupon
        const itemTotal =
            itemSubtotal + itemTax;

        return {
            id: item.order_item_id,
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            quantity: item.quantity,
            price: Number(item.price).toFixed(2),
            tax: Number(item.tax).toFixed(2),
            total: itemTotal.toFixed(2)
        };
    });


    // Final invoice calculation
    const grandTotal =
        subtotal - discount + tax;


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

        items,

        coupon: appliedCoupon,

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

    if (invoiceResult.rows.length === 0) {
        return null;
    }

    const invoice = invoiceResult.rows[0];


    // Get order items
    // Tax is taken from order_items.tax
    const itemsResult = await pool.query(
        `
        SELECT
            oi.id AS order_item_id,
            oi.product_id,
            p.product_name,
            p.size,
            oi.quantity,
            oi.price,
            oi.tax

        FROM order_items oi
        JOIN products p
            ON oi.product_id = p.id

        WHERE oi.order_id = $1

        ORDER BY oi.id
        `,
        [invoice.order_id]
    );


    // Calculate subtotal and tax
    let subtotal = 0;
    let tax = 0;

    for (const item of itemsResult.rows) {
        const itemSubtotal =
            Number(item.price) * Number(item.quantity);

        const itemTax =
            Number(item.tax) * Number(item.quantity);

        subtotal += itemSubtotal;
        tax += itemTax;
    }


    // Find active coupon
    const couponResult = await pool.query(
        `
        SELECT DISTINCT
            c.id,
            c.coupon_code,
            c.coupon_type,
            c.discount_value,
            c.minimum_order_amount,
            c.maximum_discount_amount

        FROM coupons c
        JOIN coupon_products cp
            ON c.id = cp.coupon_id
        JOIN order_items oi
            ON cp.product_id = oi.product_id

        WHERE oi.order_id = $1
          AND c.status = 'Active'
          AND c.start_date <= CURRENT_TIMESTAMP
          AND c.end_date >= CURRENT_TIMESTAMP
          AND (
              c.usage_limit IS NULL
              OR c.used_count < c.usage_limit
          )

        ORDER BY c.id
        LIMIT 1
        `,
        [invoice.order_id]
    );


    let discount = 0;
    let appliedCoupon = null;


    // Calculate coupon discount
    if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];

        const minimumOrderAmount =
            Number(coupon.minimum_order_amount || 0);

        // Coupon applies only if minimum order amount is reached
        if (subtotal >= minimumOrderAmount) {

            // Percentage coupon
            if (coupon.coupon_type === "percentage") {
                discount =
                    subtotal *
                    (Number(coupon.discount_value) / 100);
            }

            // Fixed coupon
            else if (coupon.coupon_type === "fixed") {
                discount =
                    Number(coupon.discount_value);
            }


            // Apply maximum discount limit
            if (
                coupon.maximum_discount_amount !== null &&
                discount >
                    Number(coupon.maximum_discount_amount)
            ) {
                discount =
                    Number(coupon.maximum_discount_amount);
            }


            // Discount cannot exceed subtotal
            if (discount > subtotal) {
                discount = subtotal;
            }


            appliedCoupon = {
                coupon_code: coupon.coupon_code,
                coupon_type: coupon.coupon_type,
                discount_value: Number(
                    coupon.discount_value
                ).toFixed(2)
            };
        }
    }


    // Prepare PDF items
    const items = itemsResult.rows.map(item => {

        const itemSubtotal =
            Number(item.price) * Number(item.quantity);

        const itemTax =
            Number(item.tax) * Number(item.quantity);

        const itemTotal =
            itemSubtotal + itemTax;

        return {
            id: item.order_item_id,
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            quantity: item.quantity,
            price: Number(item.price).toFixed(2),
            tax: Number(item.tax).toFixed(2),
            subtotal: itemSubtotal.toFixed(2),
            item_tax: itemTax.toFixed(2),
            total: itemTotal.toFixed(2)
        };
    });


    // Final invoice calculation
    const grandTotal =
        subtotal - discount + tax;


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
            name: `${invoice.first_name} ${invoice.last_name}`,
            email: invoice.email,
            phone: invoice.phone
        },

        items,

        coupon: appliedCoupon,

        summary: {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            grand_total: grandTotal.toFixed(2)
        }
    };
}