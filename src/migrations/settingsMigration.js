import pool from "../config/db.js";

async function createSettingsTables(){
    try{
        //General Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS general_settings(
            id SERIAL PRIMARY KEY,
            meta_title VARCHAR(255),
            meta_keywords TEXT,
            store_theme VARCHAR(100),
            layout VARCHAR(100),
            meta_description TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("General settings table created");

        //Store Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS store_settings(
            id SERIAL PRIMARY KEY,
            store_name VARCHAR(150) NOT NULL,
            store_owner_name VARCHAR(150) NOT NULL,
            owner_phone VARCHAR(20),
            owner_email VARCHAR(150) UNIQUE,
            full_address TEXT,
            zip_code VARCHAR(20),
            city VARCHAR(100),
            country VARCHAR(50),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Store settings table created");

        //Localization Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS localization_settings(
            id SERIAL PRIMARY KEY,
            language VARCHAR(50) NOT NULL,
            currency VARCHAR(50) NOT NULL,
            length_class VARCHAR(50),
            weight_class VARCHAR(50),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Localization settings table created");

        //Tax Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tax_settings(
            id SERIAL PRIMARY KEY,
            price_with_tax BOOLEAN DEFAULT FALSE,
            default_tax_rate DECIMAL(5,2) DEFAULT 18,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tax settings table created");

        //Customer Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS customer_settings(
            id SERIAL PRIMARY KEY,
            customer_online BOOLEAN DEFAULT FALSE,
            customer_activity BOOLEAN DEFAULT FALSE,
            customer_searches BOOLEAN DEFAULT FALSE,
            allow_guest_checkout BOOLEAN DEFAULT FALSE,
            login_display_price BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Customer settings table created");

        //Review Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS review_settings(
            id SERIAL PRIMARY KEY,
            allow_reviews BOOLEAN DEFAULT TRUE,
            allow_guest_reviews BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Review settings table created");

        //Voucher Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS voucher_settings(
            id SERIAL PRIMARY KEY,
            minimum_voucher INT NOT NULL CHECK(minimum_voucher >= 0),
            maximum_voucher INT NOT NULL CHECK(maximum_voucher >= minimum_voucher),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Voucher settings table created");

        //Categories Settings
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories_settings(
            id SERIAL PRIMARY KEY,
            category_product_count BOOLEAN DEFAULT FALSE,
            default_items_per_page INT DEFAULT 10 CHECK (default_items_per_page > 0),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Categories settings table created");

        process.exit();

    }catch(error){
        console.error("Migration failed:",error);
        process.exit(1);
    }
}
createSettingsTables();