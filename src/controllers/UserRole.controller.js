import {
  createUserRole,
  getAllUserRoles,
  getUserRoleById,
  updateUserRoleById,
  deleteUserRoleById
} from "../models/UserRole.model.js";


// Create User Role
export const addUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;

    const userRole = await createUserRole(
      user_id,
      role_id
    );

    res.status(201).json({
      message: "User role created successfully",
      data: userRole
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get All User Roles
export const getUserRoles = async (req, res) => {
  try {
    const userRoles = await getAllUserRoles();

    res.status(200).json({
      message: "User roles fetched successfully",
      data: userRoles
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Get User Role by ID
export const getUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const userRole = await getUserRoleById(id);

    if (!userRole) {
      return res.status(404).json({
        message: "User role not found"
      });
    }

    res.status(200).json({
      message: "User role fetched successfully",
      data: userRole
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUserRole = await updateUserRoleById(
      id,
      req.body
    );

    if (!updatedUserRole) {
      return res.status(404).json({
        message: "User role not found"
      });
    }

    res.status(200).json({
      message: "User role updated successfully",
      data: updatedUserRole
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Delete User Role
export const deleteUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUserRole = await deleteUserRoleById(id);

    if (!deletedUserRole) {
      return res.status(404).json({
        message: "User role not found"
      });
    }

    res.status(200).json({
      message: "User role deleted successfully",
      data: deletedUserRole
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};