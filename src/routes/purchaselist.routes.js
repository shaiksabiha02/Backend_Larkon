import express from "express";

import {
  getPurchaseLists,
  getPurchaseList
} from "../controllers/purchaselist.controller.js";

const router = express.Router();

router.get("/purchase-list", getPurchaseLists);

router.get("/purchase-list/:id", getPurchaseList);

export default router;