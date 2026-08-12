import * as sellerService from "../services/sellerService.js";


// Get all sellers
const getAllSellers = async (req, res) => {
  try {
    const sellers = await sellerService.getAllSellers();

    return res.status(200).json({
      success: true,
      count: sellers.length,
      data: sellers,
    });

  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to get sellers",
    });
  }
};


// Create new seller
const createSeller = async (req, res) => {
  try {
    const seller = await sellerService.createSeller(req.body);

    return res.status(201).json({
      success: true,
      message: "Seller created successfully",
      data: seller,
    });

  } catch (error) {
    console.log(error.message);

    // Check duplicate email
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Seller email already exists",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to create seller",
    });
  }
};


// Update seller status
const updateSellerStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    // Check valid id
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller id",
      });
    }

    // Check status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const seller = await sellerService.updateSellerStatus(
      id,
      status
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seller status updated successfully",
      data: seller,
    });

  } catch (error) {
    console.log(error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to update seller status",
    });
  }
};


// Export seller functions
export {
  getAllSellers,
  createSeller,
  updateSellerStatus,
};