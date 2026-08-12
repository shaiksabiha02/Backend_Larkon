import pool from "../config/db.js";

async function createProductsTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,

                product_name VARCHAR(255) NOT NULL,

                category_id INTEGER,
                seller_id INTEGER,

                brand VARCHAR(100),
                weight VARCHAR(50),
                gender VARCHAR(50),
                size VARCHAR(100),
                color VARCHAR(100),

                description TEXT,
                tag_number VARCHAR(100),
                stock INTEGER DEFAULT 0,
                tag VARCHAR(100),

                price DECIMAL(10,2) NOT NULL,
                tax DECIMAL(10,2) DEFAULT 0,

                image VARCHAR(500),
                status VARCHAR(20) DEFAULT 'active',

                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_products_category
                FOREIGN KEY (category_id)
                REFERENCES categories(id),

                CONSTRAINT fk_products_seller
                FOREIGN KEY (seller_id)
                REFERENCES sellers(id)
            );
        `);

        console.log("Products table created successfully");

    } catch (error) {
        console.error(
            "Error creating products table:",
            error.message
        );

    } finally {
        process.exit();
    }
}

createProductsTable();