import express from "express";

import {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} from "../controllers/Coupon.Controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/",authenticate, getCoupons);

router.post("/", authenticate,createCoupon);

router.put("/:id",authenticate, updateCoupon);

router.delete("/:id", authenticate,deleteCoupon);

router.post("/validate", validateCoupon);

export default router;
