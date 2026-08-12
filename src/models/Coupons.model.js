import pool from "../config/db.js";
import { getDiscountByProductID } from "./Discount.model.js";

// Creating a Coupon

export const createCoupon = async(couponData)=>{
    const {
        couponCode,
        country,
        couponType,
        discountValue,
        minimumOrderAmount,
        maximumDiscountAmount,
        usageLimit,
        status,
        startDate,
        endDate
    } = couponData;

const query = 
`INSERT INTO coupons(
coupon_code,
country,
coupon_type,
discount_value,
minimum_order_amount,
maximum_discount_amount,
usage_limit,
status,
start_date,
end_date
)
VALUES(
$1,$2,$3,$4,$5,$6,$7,$8,$9,$10
)
RETURNING *;
`;
const values =[
    couponCode,
    country,
    couponType,
    discountValue,
    minimumOrderAmount,
    maximumDiscountAmount,
    usageLimit,
    status || "Active",
    startDate,
    endDate
];
const result = await pool.query(query,values);
return result.rows[0];
};

// get all coupons

export const getAllCoupons = async ()=>{
    const query=`
    SELECT * FROM coupons
    ORDER BY id DESC;`;

    const result = await pool.query(query);
    return result.rows;
};

// get coupons by id

export const getCouponById = async(couponId)=>{
    const query =
    `Select * from coupons
    Where id = $1;
    `;

    const result = await pool.query(query,[couponId]);
    return result.rows[0];
};

// get coupon by code used while validating coupon at checkout

export const getCouponByCode = async (couponCode)=>{
    const query =
    `
    SELECT * From coupons
    WHERE UPPER(coupon_code)=UPPER($1);

    `;

    const result = await pool.query(query,[couponCode]);
    return result.rows[0];
};

// Check whether coupon code already exists

export const checkCoupounCodeExists = async (couponCode)=>{
    const query=`
    SELECT id 
    FROM coupons
    WHERE UPPER(coupon_code)=UPPER($1);`;
    const result = await pool.query(query,[couponCode]);
    return result.rows[0];
};
// edting or update coupon

export const updateCoupon = async (
    couponId,
    couponData
)=>{
    const{
        couponCode,
        country,
        couponType,
        discountValue,
        minimumOrderAmount,
        maximumDiscountAmount,
        usageLimit,
        status,
        startDate,
        endDate
    } = couponData;
    const query = 
    `
    UPDATE coupons
    SET 
    coupon_code = $1,
    country = $2,
    coupon_type = $3,
    discount_value = $4,
    minimum_order_amount = $5,
    maximum_discount_amount = $6,
    usage_limit = $7,
    status = $8,
    start_date = $9,
    end_date = $10,
    updated_at = CURRENT_TIMESTAMP
    where id = $11
    RETURNING*;
    `;

    const values =[
        couponCode,
        country,
        couponType,
        discountValue,
        minimumOrderAmount,
        maximumDiscountAmount,
        usageLimit,
        status,
        startDate,
        endDate,
        couponId
    ];

    const result = await pool.query(query,values);
    return result.rows[0];
};

// Deleting Coupon

export const deleteCoupon = async(couponId)=>{
    const query =
    `
    DELETE from coupons
    Where id = $1
    RETURNING*;
    `;

    const result = await pool.query(query,[couponId]);
    return result.rows[0];
};

// deactivate coupon insted of permanently deleting it

export const deactivateCoupon = async (couponId)=>{
    const query =
    `UPDATE coupons
     SET 
     status ='In Active',
     updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *;

    `;

    const result = await pool.query(query,[couponId]);
    return result.rows[0];
};

// increase used count only after successful order

export const increaseCouponUsage = async (couponId)=>{
    const query =
    ` UPDATE coupons
    SET 
    used_count = used_count +1,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
    `;
    const result = await pool.query(query,[couponId]);
    return result.rows[0];
};

// ADD product to Coupon

export const addCouponProduct = async(
    couponId,
    productId
)=>{
    const query =
    `
    INSERT INTO coupon_products(
    coupon_id,
    product_id 
    )
    VALUES($1,$2)
    ON CONFLICT (coupon_id,product_id)
    DO NOTHING
    RETURNING*;
    `;

    const result = await pool.query(
        query,
        [couponId,productId]
    );
    return result.rows[0];
};

//Add category to coupon

export const addCouponCategory = async(
    couponId,
    categoryId
)=>{
    const query =
    `
    INSERT INTO coupon_categories(
    coupon_id,
    category_id 
    )
    VALUES($1,$2)
    ON CONFLICT (coupon_id,category_id)
    DO NOTHING
    RETURNING*;
    `;

    const result = await pool.query(
        query,
        [couponId,categoryId]
    );
    return result.rows[0];
}

// get products assigned to coupon

export const getCouponProducts = async (
    couponId
)=>{
    const query =
    ` SELECT 
     cp.product_id
     FROM coupon_products cp
     Where cp.coupon_id = $1;
    `;
    const result = await pool.query(
        query,
        [couponId]
    );
    return result.rows;
};

// Get categories assigned to coupon

export const getCouponCategories = async (couponId) => {
    const query = `
        SELECT
            cc.category_id
        FROM coupon_categories cc
        WHERE cc.coupon_id = $1;
    `;

    const result = await pool.query(
        query,
        [couponId]
    );

    return result.rows;
};