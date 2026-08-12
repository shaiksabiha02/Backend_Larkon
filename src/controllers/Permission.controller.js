import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermissionById,
  deletePermissionById
} from "../models/Permission.model.js";


// Create Permission
export const addPermission = async (req, res) => {
  try {
    const {
      permission_name,
      description,
      status
    } = req.body;

    const permission = await createPermission(
      permission_name,
      description,
      status
    );

    res.status(201).json({
      message: "Permission created successfully",
      data: permission
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get All Permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await getAllPermissions();

    res.status(200).json({
      message: "Permissions fetched successfully",
      data: permissions
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get Permission by ID
export const getPermission = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await getPermissionById(id);

    if (!permission) {
      return res.status(404).json({
        message: "Permission not found"
      });
    }

    res.status(200).json({
      message: "Permission fetched successfully",
      data: permission
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Permission
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPermission = await updatePermissionById(
      id,
      req.body
    );

    if (!updatedPermission) {
      return res.status(404).json({
        message: "Permission not found"
      });
    }

    res.status(200).json({
      message: "Permission updated successfully",
      data: updatedPermission
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Delete Permission
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPermission = await deletePermissionById(id);

    if (!deletedPermission) {
      return res.status(404).json({
        message: "Permission not found"
      });
    }

    res.status(200).json({
      message: "Permission deleted successfully",
      data: deletedPermission
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};