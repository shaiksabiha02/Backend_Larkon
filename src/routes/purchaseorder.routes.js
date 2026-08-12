import express from "express";

import {
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrderController
} from "../controllers/purchaseorder.controller.js";

const router = express.Router();

router.get("/purchases", getPurchaseOrders);

router.get("/purchases/:id", getPurchaseOrder);

router.post("/purchases", createPurchaseOrderController);

export default router;