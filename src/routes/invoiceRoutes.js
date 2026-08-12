import express from "express";
import {listInvoices,
        fetchInvoiceById,
        sendInvoice,
        downloadInvoice
} from "../Controllers/invoiceController.js";


const router = express.Router();

router.get("/invoices", listInvoices);
router.get("/invoices/:id", fetchInvoiceById);
router.post("/invoices/:id/send",sendInvoice);
router.get("/invoices/:id/download", downloadInvoice);

export default router;