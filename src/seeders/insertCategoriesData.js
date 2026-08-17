import pool from "../config/db.js";

async function insertCategories() {
    try {
        const categories = [
            {
                category_name: "Fashion",
                description: "Fashion products"
            },
            {
                category_name: "Hand Bag",
                description: "Hand bags collection"
            },
            {
                category_name: "Cap",
                description: "Caps collection"
            },
            {
                category_name: "Electronics",
                description: "Electronic products"
            },
            {
                category_name: "Shoes",
                description: "Shoes collection"
            },
            {
                category_name: "Wallet",
                description: "Wallet collection"
            },
            {
                category_name: "Sunglass",
                description: "Sunglasses collection"
            }
        ];

        for (const category of categories) {
            await pool.query(
                `INSERT INTO categories (category_name, description)
                 VALUES ($1, $2)
                 ON CONFLICT (category_name) DO NOTHING`,
                [category.category_name, category.description]
            );
        }

        console.log("Categories inserted successfully");

    } catch (error) {
        console.error(
            "Error inserting categories:",
            error.message
        );

    } finally {
        process.exit();
    }
}

insertCategories();
