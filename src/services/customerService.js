import * as customerModel from "../models/customerModel.js";


// Get all customers
const getAllCustomers = async () => {
  return await customerModel.getAllCustomers();
};


// Get customer by id
const getCustomerById = async (id) => {
  return await customerModel.getCustomerById(id);
};


// Update customer status
const updateCustomerStatus = async (id, status) => {
  const allowedStatuses = [
    "active",
    "blocked",
    "inactive",
  ];

  // Check valid status
  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid customer status");
    error.statusCode = 400;
    throw error;
  }

  return await customerModel.updateCustomerStatus(
    id,
    status
  );
};


// Export customer service functions
export {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
};