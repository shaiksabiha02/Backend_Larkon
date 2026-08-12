import express from "express";

import {
  getInventory,
  adjustProductInventory,
  getLowStock
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/inventory", getInventory);

router.patch("/inventory/:productId/adjust", adjustProductInventory);

router.get("/inventory/low-stock", getLowStock);

export default router;