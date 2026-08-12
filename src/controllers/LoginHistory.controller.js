import {
  createLoginHistory,
  getAllLoginHistory,
  getLoginHistoryByUser,
} from "../models/LoginHistory.model.js";

// Create Login History
export const addLoginHistory = async (req, res) => {
  try {
    const { user_id, ip_address, device, browser, status } = req.body;

    const login = await createLoginHistory(
      user_id,
      ip_address,
      device,
      browser,
      status
    );

    res.status(201).json({
      message: "Login history created successfully",
      data: login,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Login History
export const fetchAllLoginHistory = async (req, res) => {
  try {
    const history = await getAllLoginHistory();

    res.status(200).json({
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Login History By User
export const fetchLoginHistoryByUser = async (req, res) => {
  try {
    const history = await getLoginHistoryByUser(req.params.user_id);

    res.status(200).json({
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};