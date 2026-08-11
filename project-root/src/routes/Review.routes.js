import express from "express";
import{
    createReview,
    getAllReviews,
    updateReviewStatus,
    deleteReview
}from "../Controllers/Review.controller.js";

const router = express.Router();
//post customer submitting a review

router.post("/",createReview);

//get reviews

router.get("/",getAllReviews);

// patch/reviews/id/status
// admin -approve ,reject
// private access

router.patch("/:id/status",updateReviewStatus);

// delete reviews/:id
// admin delete it
router.delete("/:id",deleteReview);
export default router;