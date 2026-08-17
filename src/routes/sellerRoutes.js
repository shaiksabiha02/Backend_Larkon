import express from "express";

import {
  getAllSellers,
  createSeller,
  updateSellerStatus,
} from "../controllers/sellerController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(authenticate);
// Get all sellers
router.get("/", getAllSellers);

// Create new seller
router.post("/", createSeller);

// Update seller status
router.patch("/:id/status", updateSellerStatus);


// Export router
export default router;