import express from "express";

import {
    getDashboardSummary,
    getRecentOrders,
    getSalesOverview,
    getTopProducts,
    getRevenueByCategory,
    getCustomerGrowth
} from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(authenticate);
// ========================================
// Dashboard Main
// ========================================

router.get("/", getDashboardSummary);


// ========================================
// Dashboard Summary
// ========================================

router.get("/summary", getDashboardSummary);


// ========================================
// Recent Orders
// ========================================

router.get("/recent-orders", getRecentOrders);


// ========================================
// Sales Overview
// ========================================

router.get("/sales-overview", getSalesOverview);


// ========================================
// Top Products
// ========================================

router.get("/top-products", getTopProducts);


// ========================================
// Revenue By Category
// ========================================

router.get("/revenue-by-category", getRevenueByCategory);


// ========================================
// Customer Growth
// ========================================

router.get("/customer-growth", getCustomerGrowth);


export default router;