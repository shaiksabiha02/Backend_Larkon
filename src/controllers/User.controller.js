import pool from "../config/db.js";

import {
  createUser,
  updateUserById,
  getUserById,
  getAllUsers,
  deleteUserById
} from "../models/User.model.js";


// Create User
export const addUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      username,
      email,
      phone,
      password,
      designation,
      profile_image,
      role_id,
      status
    } = req.body;

    const user = await createUser(
      first_name,
      last_name,
      full_name,
      username,
      email,
      phone,
      password,
      designation,
      profile_image,
      role_id,
      status
    );

    res.status(201).json({
      message: "User created successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await updateUserById(id, req.body);

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get User by ID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      message: "Users fetched successfully",
      data: users
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Lock User
export const lockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users
       SET status = 'Inactive'
       WHERE id = $1
       RETURNING id, email, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User locked successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("LOCK USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to lock user"
    });
  }
};


// Unlock User
export const unlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users
       SET status = 'Active'
       WHERE id = $1
       RETURNING id, email, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User unlocked successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("UNLOCK USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unlock user"
    });
  }
};