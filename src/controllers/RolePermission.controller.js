import {
  createRolePermission,
  getAllRolePermissions,
  getRolePermissionById,
  updateRolePermissionById,
  deleteRolePermissionById
} from "../models/RolePermission.model.js";

// Create Role Permission
export const addRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;

    if (!role_id || !permission_id) {
      return res.status(400).json({
        success: false,
        message: "role_id and permission_id are required"
      });
    }

    const rolePermission = await createRolePermission(
      role_id,
      permission_id
    );

    return res.status(201).json({
      success: true,
      message: "Role permission created successfully",
      data: rolePermission
    });

  } catch (error) {
    console.error("CREATE ROLE PERMISSION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create role permission"
    });
  }
};


// Get All Role Permissions
export const getRolePermissions = async (req, res) => {
  try {
    const rolePermissions = await getAllRolePermissions();

    return res.status(200).json({
      success: true,
      message: "Role permissions fetched successfully",
      data: rolePermissions
    });

  } catch (error) {
    console.error("GET ROLE PERMISSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role permissions"
    });
  }
};


// Get Role Permission By ID
export const getRolePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const rolePermission = await getRolePermissionById(id);

    if (!rolePermission) {
      return res.status(404).json({
        success: false,
        message: "Role permission not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role permission fetched successfully",
      data: rolePermission
    });

  } catch (error) {
    console.error("GET ROLE PERMISSION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role permission"
    });
  }
};


// Update Role Permission
export const updateRolePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, permission_id } = req.body;

    if (!role_id || !permission_id) {
      return res.status(400).json({
        success: false,
        message: "role_id and permission_id are required"
      });
    }

    const updatedRolePermission =
      await updateRolePermissionById(
        id,
        role_id,
        permission_id
      );

    if (!updatedRolePermission) {
      return res.status(404).json({
        success: false,
        message: "Role permission not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role permission updated successfully",
      data: updatedRolePermission
    });

  } catch (error) {
    console.error("UPDATE ROLE PERMISSION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update role permission"
    });
  }
};


// Delete Role Permission
export const deleteRolePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRolePermission =
      await deleteRolePermissionById(id);

    if (!deletedRolePermission) {
      return res.status(404).json({
        success: false,
        message: "Role permission not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role permission deleted successfully",
      data: deletedRolePermission
    });

  } catch (error) {
    console.error("DELETE ROLE PERMISSION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete role permission"
    });
  }
};