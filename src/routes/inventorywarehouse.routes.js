import express from "express";

import {
  getInventoryWarehouses,
  getInventoryWarehouse,
  createWarehouse,
  updateWarehouse
} from "../controllers/inventorywarehouse.controller.js";

const router = express.Router();

router.get("/warehouses", getInventoryWarehouses);

router.get("/warehouses/:id", getInventoryWarehouse);

router.post("/warehouses", createWarehouse);

router.put("/warehouses/:id", updateWarehouse);

export default router;