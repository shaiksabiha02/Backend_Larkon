import express from "express";

import {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
} from "../controllers/customerController.js";

const router = express.Router();


// Get all customers
router.get("/", getAllCustomers);

// Get customer by id
router.get("/:id", getCustomerById);

// Update customer status
router.patch("/:id/status", updateCustomerStatus);


// Export router
export default router;