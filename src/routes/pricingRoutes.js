import express from "express";
import {fetchPricingPlans} from "../controllers/pricingController.js";

const router=express.Router();

router.get("/pricing-plans",fetchPricingPlans);

export default router;
