import {
  getAllInventory,
  getInventoryByProductId,
  adjustInventory,
  getLowStockInventory
} from "../models/inventory.model.js";

export async function getInventory(req, res) {
  try {
    const inventory = await getAllInventory();

    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error("Inventory Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function adjustProductInventory(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required"
      });
    }

    const inventory = await getInventoryByProductId(productId);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this product"
      });
    }

    const updatedInventory = await adjustInventory(
      productId,
      quantity
    );

    if (updatedInventory.stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity cannot be negative"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedInventory
    });
  } catch (error) {
    console.error("Inventory Adjustment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to adjust inventory"
    });
  }
}

export async function getLowStock(req, res) {
  try {
    const inventory = await getLowStockInventory();

    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error("Low Stock Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch low stock inventory"
    });
  }
}