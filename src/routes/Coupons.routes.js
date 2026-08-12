import express from "express";

import {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} from "../controllers/Coupon.Controllers.js";

const router = express.Router();

router.get("/", getCoupons);

router.post("/", createCoupon);

router.put("/:id", updateCoupon);

router.delete("/:id", deleteCoupon);

router.post("/validate", validateCoupon);

export default router;
