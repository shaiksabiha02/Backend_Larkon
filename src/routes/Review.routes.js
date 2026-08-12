import express from "express";

import {
    createReview,
    getAllReviews,
    updateReviewStatus,
    deleteReview
<<<<<<< HEAD
}from "../controllers/Review.controller.js";
=======
} from "../Controllers/Review.controller.js";
>>>>>>> bf3e367e276ce25abab52a1c02a1490d7c3bbb83

const router = express.Router();

router.post("/", createReview);

router.get("/", getAllReviews);

router.patch("/:id/status", updateReviewStatus);

router.delete("/:id", deleteReview);

export default router;
