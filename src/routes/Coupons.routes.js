import express from "express";
import {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} from "../Controllers/Coupon.Controllers.js";

const router = express.Router();

// get coupons

router.get("/",getCoupons);

// post Coupons

router.post("/",createCoupon);

// put through coupon id

router.put("/:id",updateCoupon);

// delete coupon through id

router.delete("/:id",deleteCoupon);

// validate coupon
router.post("/validate",validateCoupon);

export default router;