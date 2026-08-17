import pool from "../config/db.js";

const productDiscounts = {
    "Black T-shirt": 20,
    "Olive Green Leather Bag": 37,
    "Women Gold Dress": 20,
    "Gray Cap For Men": 12,
    "Dark Green Cargo Pant": 20,
    "Orange Multi Color Headphone": 37,
    "Kids Yellow Shoes": 19,
    "Men Dark Brown Wallet": 50,
    "Kids Yellow T-shirt": 35,
    "White Rubber Band Smart Watch": 14,
    "Men Brown Leather Shoes": 40,
    "Sky Blue Sunglass": 23
};

function calculateInvoiceItem(price, quantity, unitTax, discountPerUnit) {
    const lineSubtotal = Number(price) * Number(quantity);
    const lineDiscount = Number(discountPerUnit) * Number(quantity);
    const lineTax = Number(unitTax) * Number(quantity);

    const lineTotal =
        lineSubtotal - lineDiscount + lineTax;

    return {
        lineSubtotal,
        lineDiscount,
        lineTax,
        lineTotal
    };
}

async function insertInvoices() {
    try {

        const invoiceItemsData = [
            {
                invoiceId: 10,
                productId: 5,
                productName: "Black T-shirt",
                size: "L",
                quantity: 1
            },
            {
                invoiceId: 10,
                productId: 13,
                productName: "Sky Blue Sunglass",
                size: "Standard",
                quantity: 1
            },
            {
                invoiceId: 10,
                productId: 8,
                productName: "Gray Cap For Men",
                size: "Free Size",
                quantity: 1
            },

            {
                invoiceId: 11,
                productId: 6,
                productName: "Olive Green Leather Bag",
                size: "Medium",
                quantity: 2
            },
            {
                invoiceId: 11,
                productId: 5,
                productName: "Black T-shirt",
                size: "L",
                quantity: 3
            },
            {
                invoiceId: 11,
                productId: 7,
                productName: "Women Gold Dress",
                size: "M",
                quantity: 1
            },

            {
                invoiceId: 12,
                productId: 8,
                productName: "Gray Cap For Men",
                size: "Free Size",
                quantity: 1
            },
            {
                invoiceId: 12,
                productId: 10,
                productName: "Orange Multi Color Headphone",
                size: "Standard",
                quantity: 1
            },

            {
                invoiceId: 13,
                productId: 6,
                productName: "Olive Green Leather Bag",
                size: "Medium",
                quantity: 2
            },

            {
                invoiceId: 14,
                productId: 5,
                productName: "Black T-shirt",
                size: "L",
                quantity: 1
            },
            {
                invoiceId: 14,
                productId: 7,
                productName: "Women Gold Dress",
                size: "M",
                quantity: 1
            },

            {
                invoiceId: 15,
                productId: 8,
                productName: "Gray Cap For Men",
                size: "Free Size",
                quantity: 1
            },

            {
                invoiceId: 16,
                productId: 6,
                productName: "Olive Green Leather Bag",
                size: "Medium",
                quantity: 1
            },

            {
                invoiceId: 17,
                productId: 12,
                productName: "Men Dark Brown Wallet",
                size: "Standard",
                quantity: 1
            },

            {
                invoiceId: 18,
                productId: 15,
                productName: "White Rubber Band Smart Watch",
                size: "Standard",
                quantity: 1
            }
        ];

        for (const item of invoiceItemsData) {

            const productResult = await pool.query(
                `
                SELECT
                    id,
                    price,
                    tax
                FROM products
                WHERE id = $1
                `,
                [item.productId]
            );

            if (productResult.rows.length === 0) {
                throw new Error(
                    `Product ${item.productId} not found`
                );
            }

            const product = productResult.rows[0];

            const price = Number(product.price);
            const unitTax = Number(product.tax);

            const discountPerUnit =
                Number(productDiscounts[item.productName] ?? 0);

            if (discountPerUnit > price) {
                throw new Error(
                    `Discount for ${item.productName} cannot be greater than product price`
                );
            }

            const calculated = calculateInvoiceItem(
                price,
                item.quantity,
                unitTax,
                discountPerUnit
            );

            await pool.query(
                `
                INSERT INTO invoice_items
                (
                    invoice_id,
                    product_id,
                    product_name,
                    size,
                    quantity,
                    price,
                    discount,
                    tax,
                    total
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                )
                `,
                [
                    item.invoiceId,
                    item.productId,
                    item.productName,
                    item.size,
                    item.quantity,
                    price,
                    discountPerUnit,
                    unitTax,
                    calculated.lineTotal
                ]
            );
        }

        console.log("Invoice items inserted successfully");

        await pool.query(`
            UPDATE invoices i
            SET
                subtotal = totals.subtotal,
                discount = totals.discount,
                tax = totals.tax,
                total_amount = totals.total_amount,
                updated_at = CURRENT_TIMESTAMP
            FROM (
                SELECT
                    invoice_id,
                    COALESCE(SUM(price * quantity), 0) AS subtotal,
                    COALESCE(SUM(discount * quantity), 0) AS discount,
                    COALESCE(SUM(tax * quantity), 0) AS tax,
                    COALESCE(SUM(total), 0) AS total_amount
                FROM invoice_items
                GROUP BY invoice_id
            ) totals
            WHERE i.id = totals.invoice_id
        `);

        console.log("Invoice totals calculated successfully");

    } catch (error) {
        console.error("Error inserting invoice items:", error);
    } finally {
        await pool.end();
    }
}

insertInvoices();