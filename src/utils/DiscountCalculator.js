export function calculateDiscount(price,discount){
    const discountpercentage = Number(discount) || 0;
    const discountAmount = (price * discountpercentage) /100;
    const finalPrice = price - discountAmount;
    return{
        discount:discountpercentage,
        final_price:finalPrice
    };
}