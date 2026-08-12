import pool from "../config/db.js";

// Creating a review

export const createReview = async(
    productId,
    userId,
    orderItemId,
    rating,
    reviewTitle,
    review 
)=>{
    const result = await pool.query(
        `
        INSERT INTO reviews
        ( 
        product_id,
        user_id,
        order_item_id,
        rating,
        review_title,
        review
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING*;
        `,
        [
            productId,
            userId,
            orderItemId,
            rating,
            reviewTitle,
            review
        ]
    );
    return result.rows[0];
}

// get all reviews for admin 

export const getAllReviews = async ()=>{
    const result = await pool.query(
        `
        SELECT 
        r.id,
        r.product_id,
        p.product_name,
        r.user_id,
        u.full_name AS user_name,
        u.designation AS user_designation,
        u.profile_image AS user_image,
        
        r.rating,
        r.review_title,
        r.review,
        r.status,
        r.created_at,
        r.updated_at

        FROM reviews r
        INNER JOIN products p
        ON r.product_id = p.id

        INNER JOIN users u 
        ON r.user_id = u.id

        ORDER BY r.created_at DESC;
        `
    );
    return result.rows;
};

// get review By ID 

export const getReviewById = async (reviewId) =>{
    const result = await pool.query(
        `SELECT *
        FROM reviews
        WHERE id = $1;
        `,
        [reviewId]
    );
    return result.rows[0];
};

// check existing review

export const checkExistingReview = async(orderItemId)=>{
    const result = await pool.query(
        `SELECT *
        FROM reviews
        WHERE order_item_id =$1;
        `,
        [orderItemId]
    );
    return result.rows[0];
};

// verify product is purchased or not 
export const verifyPurchasedProduct = async(
    orderItemId,
    productId,
    userId

)=>{
    const result = await pool.query(
        `
        SELECT 
        oi.id,
        oi.product_id,
        oi.order_id,
        o.user_id
        
        FROM order_items oi

        Inner join orders o
        ON oi.order_id = o.id
        where
        oi.id =$1
        AND oi.product_id = $2
        AND o.user_id = $3;
        `,
        [
            orderItemId,
            productId,
            userId
        ]
    );
    return result.rows[0];
};

// Updating reviews Status

export const updateReviewStatus = async(
    reviewId,
    status
)=>{
    const result = await pool.query(
        `
        UPDATE reviews
        SET
        status=$1,
        updated_at=CURRENT_TIMESTAMP
        where id =$2
        RETURNING*; `,
        [
            status,
            reviewId
        ]
        
    );
    return result.rows[0];
};

//Delete Review

export const deleteReview = async (reviewId)=>{
    const result = await pool.query(
        `DELETE FROM reviews
        WHERE id =$1
        RETURNING *;
        `,
        [reviewId]
    );
    return result.rows[0];
};

// product rating summary for product Module

export const getProductRatingSummary = async(productId)=>{
    const result = await pool.query(
        `SELECT 
        ROUND(AVG(rating),1) AS average_rating,
        COUNT(*)::INT AS review_count
        FROM reviews
        WHERE 
        product_id = $1
        AND status ='approved';
        `,
        [productId]
    );
    return result.rows[0];
};

// Product reviews for detail product page

export const getProductReviews = async (productId)=>{
    const result = await pool.query(
        `
        SELECT 
         r.user_id,
         u.full_name AS user_name,
         
        u.designation AS user_designation,
        u.profile_image AS user_image

        
        r.rating,
        r.review_title,
        r.review,
        r.created_at
        FROM reviews r
        INNER JOIN users u
        ON r.user_id = u.id

        WHERE 
        r.product_id = $1
        AND r.status = 'approved'
        ORDER BY r.created_at DESC;
        `,
        [productId]
    );
    return result.rows;
};

// top reviews for product details page

export const getTopReviews = async(
    productId,
    limit = 5

)=>{
    const result = await pool.query(
        `
        SELECT 
        r.user_id,
        u.full_name AS user_name,
        u.designation AS user_designation,
        u.profile_image AS user_image

        r.rating,
        r.review_title,
        r.review,
        r.created_at
        FROM reviews r

        INNER JOIN users u
        ON r.user_id = u.id

        WHERE
        r.product_id = $1
        AND status ='approved'

        ORDER BY
        r.rating DESC,
        r.created_at DESC
        LIMIT $2;
        `,
        [
            productId,
            limit
        ]
    );
    return result.rows;
};