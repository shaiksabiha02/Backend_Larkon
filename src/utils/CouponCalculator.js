// calculate discount
export const calculateCouponDiscount = (coupon,cartTotal)=>{

    const total = Number(cartTotal);
let discountAmount = 0;
let freeShipping = false;
// coupon percentage
if(coupon.coupon_type ==="percentage"){
    discountAmount = (Number(cartTotal)*Number(coupon.discount_value))/100;

    // maximum discount check
    if(coupon.maximum_discount_amount !==null && discountAmount > Number(coupon.maximum_discount_amount)
){
    discountAmount =Number(coupon.maximum_discount_amount);
}
}

// Fixed amount coupon

else if(
    coupon.coupon_type == "fixed_amount"
){
    discountAmount = Number(coupon.discount_value);
    // Discount cannot exceed cart total 
    if(discountAmount > Number(cartTotal)){
        discountAmount = Number(cartTotal);
    }
}
    
// Free shipping
else if (
    coupon.coupon_type === "free_shipping"
){
    discountAmount = 0;
    freeShipping = true;
}
// Final total
const finalTotal = Number(cartTotal) - discountAmount;
return {
    valid:true,
    message:"Coupon applied successfully.",
    coupon:{
        id:coupon.id,
        couponCode:coupon.coupon_code,
        couponType:coupon.coupon_type
    },
    cartTotal:Number(cartTotal),
    discountAmount,
    finalTotal,
    freeShipping:
    coupon.coupon_type==="free_shipping"
};

};