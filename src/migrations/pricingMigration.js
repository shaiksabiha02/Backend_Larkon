import pool from "../config/db.js";

async function createPricingTables(){
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pricing_plans(
            id SERIAL PRIMARY KEY,
            plan_name VARCHAR(100) UNIQUE NOT NULL,
            price_in_dollars DECIMAL(10,2) NOT NULL CHECK (price_in_dollars >= 0),
            billing_cycle VARCHAR(20) NOT NULL,
            storage VARCHAR(50),
            bandwidth VARCHAR(50),
            domains INT CHECK (domains >= 0),
            email_support BOOLEAN DEFAULT FALSE,
            support VARCHAR(50),
            users VARCHAR(50),
            is_popular BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Pricing plans table created");
        process.exit();
    }catch(error){
        console.log("Migration failed:",error);
        process.exit(1);
    }
}
createPricingTables();