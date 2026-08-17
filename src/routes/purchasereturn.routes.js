import express from "express";
import {
  getPurchaseReturns,
  getPurchaseReturn,
  createPurchaseReturnController
} from "../controllers/purchasereturn.controller.js";

const router = express.Router();

router.get("/returns", getPurchaseReturns);

router.get("/purchase-returns/:id", getPurchaseReturn);
router.post("/purchases/:id/return", createPurchaseReturnController);

export default router;