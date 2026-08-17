import express from "express";

import {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
} from "../controllers/customerController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(authenticate);
// Get all customers
router.get("/", getAllCustomers);

// Get customer by id
router.get("/:id", getCustomerById);

// Update customer status
router.patch("/:id/status", updateCustomerStatus);


// Export router
export default router;