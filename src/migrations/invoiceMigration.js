import pool from "../config/db.js";
async function createInvoiceTables(){
    try{
        //Invoices tables

        //invoices table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS invoices(
            id SERIAL PRIMARY KEY,
            invoice_number VARCHAR(50) UNIQUE NOT null,
            customer_id INT NOT NULL REFERENCES customers(id),
            billing_name VARCHAR(150),
            billing_email VARCHAR(255),
            billing_phone VARCHAR(30);
            billing_address TEXT;
            order_date DATE NOT NULL,
            due_date DATE NOT NULL,
            payment_method VARCHAR(50) CHECK (payment_method IN ('Mastercard','Visa','Paypal')),
            subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal>=0),
            tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax>=0),
            discount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount>=0),
            total_amount DECIMAL(10,2) NOT NULL CHECK(total_amount>=0),
            status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Cancel','Completed','Pending')),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            orders_id INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT
            `);
        console.log("Invoices table created");
        
        //invoice_items table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS invoice_items(
            id SERIAL PRIMARY KEY,
            invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
            product_id INT NOT NULL REFERENCES products(id),
            product_name VARCHAR(100) NOT NULL,
            size VARCHAR(50),
            quantity INT NOT NULL CHECK (quantity>0),
            price DECIMAL (10,2) NOT NULL CHECK(price>=0),
            discount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
            tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK(tax>=0),
            total DECIMAL(10,2) NOT NULL CHECK(total>=0)
            );
        `);
        console.log("Invoice items table created");

        //invoice email logs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS invoice_email_logs(
            id SERIAL PRIMARY KEY,
            invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
            recipient_email VARCHAR(200) NOT NULL,
            sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) DEFAULT 'Sent' CHECK (status IN ('Sent','Failed')));
        `);
        console.log("Invoice email logs created");

        process.exit();

    }catch(error){
        console.error("Migration failed:",error);
        process.exit(1);

    }
}

createInvoiceTables();