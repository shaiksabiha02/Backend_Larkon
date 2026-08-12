    import pool from "../config/db.js";

// Create Product
async function createProduct(product) {
    const {
        product_name,
        category_id,
        seller_id,
        brand,
        weight,
        gender,
        size,
        color,
        description,
        tag_number,
        stock,
        tag,
        price,
        tax,
        image,
        status
    } = product;

    const query = `
        INSERT INTO products
        (
            product_name,
            category_id,
            seller_id,
            brand,
            weight,
            gender,
            size,
            color,
            description,
            tag_number,
            stock,
            tag,
            price,
            tax,
            image,
            status
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,
            $9,$10,$11,$12,$13,$14,$15,$16
        )
        RETURNING *;
    `;

    const values = [
        product_name,
        category_id,
        seller_id,
        brand,
        weight,
        gender,
        size,
        color,
        description,
        tag_number,
        stock,
        tag,
        price,
        tax,
        image,
        status
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// Bulk Create Products
async function bulkCreateProducts(products) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const insertedProducts = [];

        const query = `
            INSERT INTO products
            (
                product_name,
                category_id,
                seller_id,
                brand,
                weight,
                gender,
                size,
                color,
                description,
                tag_number,
                stock,
                tag,
                price,
                tax,
                image,
                status
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8,
                $9,$10,$11,$12,$13,$14,$15,$16
            )
            RETURNING *;
        `;

        for (const product of products) {
            const {
                product_name,
                category_id,
                seller_id,
                brand,
                weight,
                gender,
                size,
                color,
                description,
                tag_number,
                stock,
                tag,
                price,
                tax,
                image,
                status
            } = product;

            const values = [
                product_name,
                category_id,
                seller_id || null,
                brand,
                weight,
                gender,
                size,
                color,
                description,
                tag_number,
                stock,
                tag,
                price,
                tax,
                image || JSON.stringify([]),
                status || "active"
            ];

            const result = await client.query(query, values);

            insertedProducts.push(result.rows[0]);
        }

        await client.query("COMMIT");

        return insertedProducts;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}


// Get All Products With Discount and Reviews
async function getAllProducts() {
    const result = await pool.query(`
        SELECT
            products.*,
            discounts.discount,

            COALESCE(
                ROUND(AVG(reviews.rating), 2),
                0
            ) AS average_rating,

            COUNT(reviews.id)::int AS review_count

        FROM products

        LEFT JOIN discounts
            ON products.id = discounts.product_id

        LEFT JOIN reviews
            ON products.id = reviews.product_id

        GROUP BY
            products.id,
            discounts.discount

        ORDER BY products.id DESC;
    `);

    return result.rows;
}


// Get Product By ID With Discount and Reviews
async function getProductById(id) {
    const result = await pool.query(
        `
        SELECT
            products.*,
            discounts.discount,

            COALESCE(
                ROUND(AVG(reviews.rating), 2),
                0
            ) AS average_rating,

            COUNT(reviews.id)::int AS review_count

        FROM products

        LEFT JOIN discounts
            ON products.id = discounts.product_id

        LEFT JOIN reviews
            ON products.id = reviews.product_id

        WHERE products.id = $1

        GROUP BY
            products.id,
            discounts.discount;
        `,
        [id]
    );

    return result.rows[0];
}


// Update Product
async function updateProduct(id, product) {
    const {
        product_name,
        category_id,
        seller_id,
        brand,
        weight,
        gender,
        size,
        color,
        description,
        tag_number,
        stock,
        tag,
        price,
        tax,
        image,
        status
    } = product;

    const query = `
        UPDATE products
        SET
            product_name = $1,
            category_id = $2,
            seller_id = $3,
            brand = $4,
            weight = $5,
            gender = $6,
            size = $7,
            color = $8,
            description = $9,
            tag_number = $10,
            stock = $11,
            tag = $12,
            price = $13,
            tax = $14,
            image = $15,
            status = $16,
            updated_at = NOW()
        WHERE id = $17
        RETURNING *;
    `;

    const values = [
        product_name,
        category_id,
        seller_id,
        brand,
        weight,
        gender,
        size,
        color,
        description,
        tag_number,
        stock,
        tag,
        price,
        tax,
        image,
        status,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// Delete Product
async function deleteProduct(id) {
    const result = await pool.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
}


// Update Product Images
async function updateProductImages(id, images) {
    const query = `
        UPDATE products
        SET
            image = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
    `;

    const values = [
        JSON.stringify(images),
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// Update Product Status
async function updateProductStatus(id, status) {
    const result = await pool.query(
        `
        UPDATE products
        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
        `,
        [status, id]
    );

    return result.rows[0];
}


export {
    createProduct,
    bulkCreateProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductImages,
    updateProductStatus
};