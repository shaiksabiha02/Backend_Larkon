import pool from "../config/db.js";

//faqs
export async function getFaqs(){

    const result = await pool.query(
        `
        SELECT *
        FROM faqs
        WHERE is_active = TRUE
        ORDER BY category,display_order

        `
    );

    return result.rows;
}

//help center
export async function getHelpCenter(){

    const result = await pool.query(
        `
        SELECT *
        FROM help_center
        ORDER BY id
        `
    );

    return result.rows;
}


//privacy policy
export async function getPrivacyPolicy(){

    const result = await pool.query(
        `
        SELECT *
        FROM privacy_policy
        ORDER BY id
        `
    );

    return result.rows;
}