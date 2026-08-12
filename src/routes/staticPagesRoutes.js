import express from "express";
import {
    fetchFaqs,
    fetchHelpCenter,
    fetchPrivacyPolicy
} from "../controllers/staticPagesController.js";

const router = express.Router();

router.get("/faqs", fetchFaqs);
router.get("/help-center", fetchHelpCenter);
router.get("/privacy-policy", fetchPrivacyPolicy);

export default router;