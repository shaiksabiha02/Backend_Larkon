import express from "express";

import {
  getInventoryReceived,
  getInventoryReceivedByIdController
} from "../controllers/inventoryreceived.controller.js";

const router = express.Router();

router.get("/inventory-received", getInventoryReceived);

router.get(
  "/inventory-received/:id",
  getInventoryReceivedByIdController
);

export default router;