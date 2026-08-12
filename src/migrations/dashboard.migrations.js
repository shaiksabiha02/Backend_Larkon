const pool = require("../config/db");

async function createCategoriesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Categories table created successfully");
    } catch (error) {
        console.error("❌ Error creating categories table:", error.message);
    } finally {
        process.exit();
    }
}

const pool = require("../config/db");

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

        console.log("✅ Products table created successfully");

    } catch (error) {

        console.error(
            "❌ Error creating products table:",
            error.message
        );

    } finally {

        process.exit();
    }
}

createProductsTable();

import Pool from "../config/db.js";
async function createOrdersTable() {
    await Pool.query(`
           
        
  CREATE TYPE order_status AS ENUM ('received', 'processing', 'shipped', 'delivered', 'cancelled');
            CREATE TYPE order_priority AS ENUM ('low','normal' ,'medium', 'high');
            CREATE TYPE ORDER_PAYMENT_STATUS AS ENUM ('pending', 'completed', 'failed','refunded');
        

            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                user_id INT NOT NULL,
                priority order_priority DEFAULT 'normal',
                total_amount NUMERIC(10, 2) NOT NULL,
                payment_status ORDER_PAYMENT_STATUS DEFAULT 'pending',
                items NUMERIC(10, 0) NOT NULL,
                Delivery_number varchar(20) NULL, 
                status order_status DEFAULT 'received',
                SHIPPING_ADDRESS TEXT,
                CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    
    );

            
    `);
    console.log("Orders table CREATED successfully.");
    process.exit();
};
 createOrdersTable();

 import Pool from "../config/db.js";
async function createOrderItemsTable() {
    await Pool.query(`

    CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
    `);
    console.log("Order_items table created successfully.");
    process.exit();
}
 createOrderItemsTable();

 import pool from "../config/db.js";

const createUserTable = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,

        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        full_name VARCHAR(200) NOT NULL,

        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),

        password VARCHAR(255) NOT NULL,

        designation VARCHAR(100),
        profile_image TEXT,

        role_id INT,
        status VARCHAR(20) DEFAULT 'Active',

        last_login TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE SET NULL
      );
    `);

    console.log("Users table created successfully.");
  } catch (error) {
    console.error("Error creating users table:", error.message);
  } finally {
    process.exit();
  }
};

createUserTable();