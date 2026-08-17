import pool from "../config/db.js";

export async function getPricingPlans(){
    try{
        const result=await pool.query(
            `
            SELECT
            id,
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
            FROM pricing_plans
            ORDER BY id;
            
            `
        );
        return result.rows

    }catch(error){
        console.error("Failed to fetch pricing plans:",error);
        throw error;
    }

}