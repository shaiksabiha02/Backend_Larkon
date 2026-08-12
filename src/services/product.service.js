import * as DiscountModel from "../models/Discount.model.js";

async function addDiscountToProduct(productId, discount) {
    const result = await DiscountModel.createDiscount(
        productId,
        discount
    );

    return result;
}

export {
    addDiscountToProduct
};