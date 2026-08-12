import pool from "../config/db.js";

async function insertAttributesData() {
    try {
        const query = `
            INSERT INTO attributes
            (attribute_name, attribute_value)
            VALUES

            -- Brands
            ('Brand', 'Nike'),
            ('Brand', 'Zara'),
            ('Brand', 'Puma'),
            ('Brand', 'Levis'),
            ('Brand', 'Sony'),
            ('Brand', 'Adidas'),
            ('Brand', 'Woodland'),
            ('Brand', 'RayBan'),
            ('Brand', 'Apple'),
            ('Brand', 'Bata'),
            ('Brand', 'Gucci'),

            -- Colors
            ('Color', 'Black'),
            ('Color', 'Brown'),
            ('Color', 'Gold'),
            ('Color', 'Gray'),
            ('Color', 'Yellow'),
            ('Color', 'Orange'),
            ('Color', 'White'),
            ('Color', 'Sky Blue'),
            ('Color', 'Dark Green'),
            ('Color', 'Olive Green'),

            -- Sizes
            ('Size', 'S'),
            ('Size', 'M'),
            ('Size', 'L'),
            ('Size', '30'),
            ('Size', '32'),
            ('Size', '42'),
            ('Size', 'Medium'),
            ('Size', 'Standard'),
            ('Size', 'Free Size'),

            -- Weight
            ('Weight', '150gm'),
            ('Weight', '180gm'),
            ('Weight', '200gm'),
            ('Weight', '250gm'),
            ('Weight', '300gm'),
            ('Weight', '350gm'),
            ('Weight', '450gm'),
            ('Weight', '500gm'),
            ('Weight', '700gm'),
            ('Weight', '750gm'),
            ('Weight', '850gm'),
            ('Weight', '900gm'),

            -- Gender
            ('Gender', 'Men'),
            ('Gender', 'Women'),
            ('Gender', 'Kids'),
            ('Gender', 'Unisex'),

            -- Tags
            ('Tag', 'New'),
            ('Tag', 'Trending'),
            ('Tag', 'Best Seller'),
            ('Tag', 'Popular'),
            ('Tag', 'Hot'),
            ('Tag', 'Premium'),
            ('Tag', 'Featured');
        `;

        await pool.query(query);

        console.log("Attributes data inserted successfully");

    } catch (error) {
        console.error(
            "Error inserting attributes data:",
            error.message
        );

    } finally {
        process.exit();
    }
}

insertAttributesData();
