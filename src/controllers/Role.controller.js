import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
} from "../models/Role.model.js";


// Create Role
export const addRole = async (req, res) => {
  try {
    const {
      role_name,
      description,
      status
    } = req.body;

    const role = await createRole(
      role_name,
      description,
      status
    );

    res.status(201).json({
      message: "Role created successfully",
      data: role
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get All Roles
export const getRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();

    res.status(200).json({
      message: "Roles fetched successfully",
      data: roles
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get Role by ID
export const getRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await getRoleById(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.status(200).json({
      message: "Role fetched successfully",
      data: role
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRole = await updateRoleById(id, req.body);

    if (!updatedRole) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.status(200).json({
      message: "Role updated successfully",
      data: updatedRole
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Delete Role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRole = await deleteRoleById(id);

    if (!deletedRole) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.status(200).json({
      message: "Role deleted successfully",
      data: deletedRole
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};