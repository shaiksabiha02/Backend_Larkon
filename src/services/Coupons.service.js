import {
    createCoupon,
    addCouponProduct,
    addCouponCategory,
    getAllCoupons,
    getCouponById,
    getCouponByCode,
    updateCoupon,
    deactivateCoupon,
    getCouponProducts,
    getCouponCategories
} from "../models/Coupons.model.js";
import {
    calculateCouponDiscount
} from "../utils/CouponCalculator.js";
// create coupom

export const createCouponService = async (couponData)=>{
    const{
        productsIds,
        categoryIds
    }= couponData;

    // Create main coupon

    const coupon = await createCoupon(couponData);

    // Adding selected products
    if(productsIds && productsIds.length >0){

        for(const productID of productsIds){
            await addCouponProduct(
            coupon.id,
            productID
        ); 
        }
        
    }
    // Add selected categories

    if(categoryIds && categoryIds.length >0){

        for(const categoryId of categoryIds){
         await addCouponCategory(
            coupon.id,
            categoryId
        );   
        }
       
    }

    return coupon;
};

// Get All Coupons

export const getCouponsService = async()=>{
    return await getAllCoupons();
};

// Update Coupon

export const updateCouponService = async(
    couponId,
    couponData
)=>{
    const existingCoupon = await getCouponById(couponId);
    if(!existingCoupon){
        throw new Error("Coupon not found.");
    }
    return await updateCoupon(
        couponId,
        couponData
    );
};

// delete or deactivate coupon

export const deleteCouponService = async(
    couponId
)=>{
    const existingCoupon = await getCouponById(couponId);
    if(!existingCoupon){
        throw new Error("Coupon not found.");
    }
    // soft delete - change status
    return await deactivateCoupon(couponId);
};

// validate coupon at checkout

export const validateCouponService = async(
    couponCode,
    cartTotal,
    cartItems
)=>{
    //finding coupon

    const coupon = await getCouponByCode(couponCode);
    if(!coupon){
        throw new Error("Invalid coupon code.");
    }

    // checking coupon status
    if(coupon.status!=="Active"){
        throw new Error("This coupon is not active");
    }

   // check start date

   const currentDate = new Date();
   if(currentDate < new Date(coupon.start_date)){
    throw new Error("This coupon is not active yet.");

   }

   // check expiry date
   if(currentDate > new Date(coupon.end_date)){
    throw new Error("This coupon has expired.");
   }
   //check usage limit

   if(coupon.used_count >=coupon.usage_limit){
    throw new Error("Coupon usage limit has been reached.");

   }
   // check minimum order amount
   if(
    Number(cartTotal) <
    Number(coupon.minimum_order_amount)
   ){
    throw new Error(
        `Minimum order amount is ${coupon.minimum_order_amount}.`
    );
   }
  // check product restrictions

  const couponProducts = await getCouponProducts(coupon.id);
  if (couponProducts.length > 0){
    const applicableProduct = cartItems.some(
        (item)=>
            couponProducts.some((couponProduct)=>Number(couponProduct.product_id)===Number(item.productId))
    );
    if(!applicableProduct){
        throw new Error(
            "This coupon is not applicable to products in your cart"
        );
    }
  }

// checking category restrictions

const couponcategories = await getCouponCategories(coupon.id);
if(couponcategories.length > 0){
    const applicableCategory = cartItems.some(
        (item)=>couponcategories.some(
            (couponCategory)=>Number(couponCategory.category_id)===Number(item.categoryId)
        )
    );
    if(!applicableCategory){
        throw new Error("This coupon is not applicable to categories in your cart.");
    }
}


// calculate coupon discount

const calculation = calculateCouponDiscount(
    coupon,
    cartTotal
);

return {
    coupon,
    ...calculation
};
};