import {
    getGeneralSettings,
    updateGeneralSettings,
    getAdminProfile,
    updateAdminProfile,
    changeUserPassword
} from "../services/settingsService.js";

// GET general settings
export async function fetchGeneralSettings(req, res) {

    try {
        
        const settings = await getGeneralSettings();

        res.status(200).json({
            success: true,
            data: settings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch general settings"
        });

    }

}

// PUT general settings
export async function editGeneralSettings(req, res) {

    try {

        const updatedSettings = await updateGeneralSettings(req.body);

        res.status(200).json({
            success: true,
            message: "General settings updated successfully",
            data: updatedSettings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update general settings"
        });

    }

}

//fetching Admin profile
export async function fetchAdminProfile(req, res) {
    try {
        const profile = await getAdminProfile(req.user.id);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error("Error fetching admin profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin profile"
        });
    }
}

//editing the admin profile
export async function editAdminProfile(req, res) {
    try {
        const profile = await updateAdminProfile(
            req.user.id,
            req.body
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            data: profile
        });

    } catch (error) {
        console.error("Error updating admin profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update admin profile"
        });
    }
}

// Changing user password
export async function changePasswordController(req, res) {
    console.log("PASSWORD CONTROLLER HIT");
    console.log("req.user:", req.user);

    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
            });
        }

        const result = await changeUserPassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        if (result.type === "not_found") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (result.type === "invalid_password") {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Error changing password:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
}