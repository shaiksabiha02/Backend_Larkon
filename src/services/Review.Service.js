import{
    createReview,
    getAllReviews,
    getReviewById,
    checkExistingReview,
    verifyPurchasedProduct,
    updateReviewStatus,
    deleteReview
} from "../models/Reviews.model.js";

// Submit Review 
export const submitReview = async(reviewData)=>{
    const {
        productId,
        userId,
        orderItemId,
        rating,
        reviewTitle,
        review
    }=reviewData;
    
    //Verify purchase
    const purchasedProduct =await verifyPurchasedProduct(
        orderItemId,
        productId,
        userId
    );
    if (!purchasedProduct){
        throw new Error(
            "Only verified purchasers can submit a review."
        );
    }
    // check duplicate review

    const existingReview = await checkExistingReview(orderItemId);
    if(existingReview){
        throw new Error(
            "Review already submitted for this purchase."
        );
    }
    // Create Review
    return await createReview(
        productId,
        userId,
        orderItemId,
        rating,
        reviewTitle,
        review
    );
};

// get reviews (admin)

export const getReviews = async ()=>{
    return await getAllReviews();
};

//Change Review Status

export const changeReviewStatus = async(
    reviewId,
    status
)=>{
    const review = await getReviewById(reviewId);
    if(!review){
        throw new Error(
            "Review not found."
        );
    }
    return await updateReviewStatus(
        reviewId,
        status
    );
};

// Delete Review

export const removeReview = async(
    reviewId
)=>{
    const review = await getReviewById(reviewId);
    if (!review){
        throw new Error(
            "Review not found."
        );
    }
    return await deleteReview(
        reviewId
    );
};