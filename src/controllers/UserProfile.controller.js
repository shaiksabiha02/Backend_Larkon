import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../models/UserProfile.model.js";

// Create User Profile
export const addUserProfile = async (req, res) => {
  try {
    const {
      user_id,
      full_name,
      designation,
      profile_image,
      address,
      bio,
    } = req.body;

    const profile = await createUserProfile(
      user_id,
      full_name,
      designation,
      profile_image,
      address,
      bio
    );

    res.status(201).json({
      message: "User profile created successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Profile
export const fetchUserProfile = async (req, res) => {
  try {
    const profile = await getUserProfile(req.params.user_id);

    res.status(200).json({
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update User Profile
export const editUserProfile = async (req, res) => {
  try {
    const {
      full_name,
      designation,
      profile_image,
      address,
      bio,
    } = req.body;

    const profile = await updateUserProfile(
      req.params.user_id,
      full_name,
      designation,
      profile_image,
      address,
      bio
    );

    res.status(200).json({
      message: "User profile updated successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};