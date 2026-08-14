import pool from "../config/db.js";


// Get all invoices
export async function getAllInvoices() {

    const result = await pool.query(
        "SELECT * FROM invoices ORDER BY id"
    );

    return result.rows;
}


// Get invoice by id
export async function getInvoiceById(id) {

    const result = await pool.query(
        "SELECT * FROM invoices WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

export async function updateInvoice(id, data) {

    const result = await pool.query(
        `
        UPDATE invoices
        SET 
            payment_status = $1,
            payment_method = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
        `,
        [
            data.payment_status,
            data.payment_method,
            id
        ]
    );

    return result.rows[0];
}