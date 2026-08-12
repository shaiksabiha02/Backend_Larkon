import express from "express";

import {
  getAllSellers,
  createSeller,
  updateSellerStatus,
} from "../controllers/sellerController.js";

const router = express.Router();


// Get all sellers
router.get("/", getAllSellers);

// Create new seller
router.post("/", createSeller);

// Update seller status
router.patch("/:id/status", updateSellerStatus);


// Export router
export default router;