import pool from "../config/db.js";

async function insertSettingsData() {
    try {

        // General Settings
        await pool.query(`
            INSERT INTO general_settings
            (
            meta_title,
            meta_keywords,
            store_theme,
            layout,
            meta_description
            )
            VALUES
            (
            'Larkon Admin',
            'admin, ecommerce, dashboard',
            'Default',
            'Default',
            'Manage your Larkon store settings and dashboard configuration.'
            );
        `);
        console.log("General Settings inserted successfully.");

        // Store Settings
        await pool.query(`
            INSERT INTO store_settings
            (
            store_name,
            store_owner_name,
            owner_phone,
            owner_email,
            full_address,
            zip_code,
            city,
            country
            )
            VALUES
            (
            'Larkon Store',
            'Admin User',
            '+91 9876543210',
            'admin@larkon.com',
            '123 MG Road',
            '500001',
            'Hyderabad',
            'India'
            );
        `);
        console.log("Store Settings inserted successfully.");

        // Localization Settings
        await pool.query(`
            INSERT INTO localization_settings
            (
            language,
            currency,
            length_class,
            weight_class
            )
            VALUES
            (
            'English',
            'US Dollar',
            'Centimeter',
            'Kilogram'
            );
        `);
        console.log("Localization Settings inserted successfully.");

        // Tax Settings
        await pool.query(`
            INSERT INTO tax_settings
            (
            price_with_tax,
            default_tax_rate
            )
            VALUES
            (
            TRUE,
            18
            );
        `);
        console.log("Tax Settings inserted successfully.");

        // Customer Settings
        await pool.query(`
            INSERT INTO customer_settings
            (
            customer_online,
            customer_activity,
            customer_searches,
            allow_guest_checkout,
            login_display_price
            )
            VALUES
            (
            TRUE,
            TRUE,
            TRUE,
            FALSE,
            FALSE
            );
        `);
        console.log("Customer Settings inserted successfully.");

        // Review Settings
        await pool.query(`
            INSERT INTO review_settings
            (
            allow_reviews,
            allow_guest_reviews
            )
            VALUES
            (
            TRUE,
            FALSE
            );
        `);
        console.log("Review Settings inserted successfully.");

        // Voucher Settings
        await pool.query(`
            INSERT INTO voucher_settings
            (
            minimum_voucher,
            maximum_voucher
            )
            VALUES
            (
            1,
            12
            );
        `);
        console.log("Voucher Settings inserted successfully.");

        // Categories Settings
        await pool.query(`
            INSERT INTO categories_settings
            (
            category_product_count,
            default_items_per_page
            )
            VALUES
            (
            TRUE,
            10
            );
        `);
        console.log("Categories Settings inserted successfully.");

    } catch (error) {
        console.error("Error inserting Settings data:", error);
    } finally {
        process.exit();
    }
}

insertSettingsData();