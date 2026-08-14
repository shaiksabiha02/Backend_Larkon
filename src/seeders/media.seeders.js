import pool from "../config/db.js";

export async function seedMedia() {
    await pool.query(`
        INSERT INTO media
        (
            file_name,
            file_url,
            file_type,
            file_size
        )
        VALUES
        (
            'product-bag.jpg',
            'https://example.com/uploads/product-bag.jpg',
            'image/jpeg',
            245678
        ),
        (
            'product-shoes.png',
            'https://example.com/uploads/product-shoes.png',
            'image/png',
            356789
        ),
        (
            'product-watch.webp',
            'https://example.com/uploads/product-watch.webp',
            'image/webp',
            198456
        ),
        (
            'product-shirt.jpg',
            'https://example.com/uploads/product-shirt.jpg',
            'image/jpeg',
            289345
        ),
        (
            'product-cap.png',
            'https://example.com/uploads/product-cap.png',
            'image/png',
            167890
        );
    `);

    console.log("✅ Media sample data inserted successfully");
}

seedMedia()
    .catch((error) => {
        console.error("❌ Media seeder failed:", error);
    })
    .finally(() => {
        pool.end();
    });