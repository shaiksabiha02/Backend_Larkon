import express from "express";

import {
    createReview,
    getAllReviews,
    updateReviewStatus,
    deleteReview

}from "../controllers/Review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = express.Router();
//post customer submitting a review

router.post("/", createReview);

router.get("/",authenticate, getAllReviews);

router.patch("/:id/status",authenticate,updateReviewStatus);

router.delete("/:id", authenticate,deleteReview);

export default router;
