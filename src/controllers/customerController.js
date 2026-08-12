import * as customerService from "../services/customerService.js";


// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to get customers",
    });
  }
};


// Get customer by id
const getCustomerById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check valid id
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer id",
      });
    }

    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to get customer",
    });
  }
};


// Update customer status
const updateCustomerStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    // Check valid id
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer id",
      });
    }

    // Check status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const customer = await customerService.updateCustomerStatus(
      id,
      status
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer status updated successfully",
      data: customer,
    });

  } catch (error) {
    console.log(error.message);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


// Export customer functions
export {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
};