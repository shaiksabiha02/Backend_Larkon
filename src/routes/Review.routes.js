import express from "express";

import {
    createReview,
    getAllReviews,
    updateReviewStatus,
    deleteReview
} from "../Controllers/Review.controller.js";

const router = express.Router();

router.post("/", createReview);

router.get("/", getAllReviews);

router.patch("/:id/status", updateReviewStatus);

router.delete("/:id", deleteReview);

export default router;
