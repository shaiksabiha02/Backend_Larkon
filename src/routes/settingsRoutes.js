import express from "express";

import {
    fetchGeneralSettings,
    editGeneralSettings,
    fetchAdminProfile,
    editAdminProfile,
    changePasswordController
} from "../Controllers/settingsController.js";

import { authenticate } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/general", authenticate,fetchGeneralSettings);
router.put("/general",authenticate, editGeneralSettings);
router.get("/profile",authenticate,fetchAdminProfile);
router.put("/profile",authenticate,editAdminProfile);
router.put("/profile/password",authenticate,changePasswordController);

export default router;