import pool from "../config/db.js";

async function insertPricingPlans(){
    try{
        await pool.query(`
            INSERT INTO pricing_plans
            (
            plan_name,
            price_in_dollars,
            billing_cycle,
            storage,
            bandwidth,
            domains,
            email_support,
            support,
            users,
            is_popular
            )
            VALUES
            (
            'Free Pack',
            0.00,
            'Month',
            '5 GB',
            '100 GB',
            1,
            FALSE,
            'No Support',
            '1 User',
            FALSE
            ),

            (
            'Professional Pack',
            19.00,
            'Month',
            '50 GB',
            '900 GB',
            2,
            TRUE,
            '24x7 Support',
            '5 Users',
            TRUE
            ),

            (
            'Business Pack',
            29.00,
            'Month',
            '500 GB',
            '2.5 TB',
            5,
            TRUE,
            '24x7 Support',
            '10 Users',
            FALSE
            ),

            (
            'Enterprise Pack',
            49.00,
            'Month',
            '2 TB',
            'Unlimited',
            50,
            TRUE,
            '24x7 Support',
            'Unlimited Users',
            FALSE
            );
        `);
        console.log("Pricing plans inserted successfully");
    }catch(error){
        console.error("Error while inserting pricing plans:",error);
    }finally{
        process.exit();

    }
}
insertPricingPlans();