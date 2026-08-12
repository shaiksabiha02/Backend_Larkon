import * as sellerModel from "../models/sellerModel.js";


// Get all sellers
const getAllSellers = async () => {
  return await sellerModel.getAllSellers();
};


// Create new seller
const createSeller = async (data) => {
  return await sellerModel.createSeller(data);
};


// Update seller status
const updateSellerStatus = async (id, status) => {
  const allowedStatuses = [
    "pending",
    "approved",
    "suspended",
    "rejected",
  ];

  // Check valid status
  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid seller status");
    error.statusCode = 400;
    throw error;
  }

  return await sellerModel.updateSellerStatus(
    id,
    status
  );
};


// Export seller service functions
export {
  getAllSellers,
  createSeller,
  updateSellerStatus,
};