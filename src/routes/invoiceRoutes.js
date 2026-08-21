import express from "express";
import {listInvoices,
        fetchInvoiceById,
        sendInvoice,
        downloadInvoice
} from "../controllers/invoiceController.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/invoices", authenticate,listInvoices);
router.get("/invoices/:id", authenticate,fetchInvoiceById);
router.post("/invoices/:id/send",authenticate,sendInvoice);
router.get("/invoices/:id/download", authenticate,downloadInvoice);

export default router;
