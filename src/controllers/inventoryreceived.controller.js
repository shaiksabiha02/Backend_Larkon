import {
  getAllInventoryReceived,
  getInventoryReceivedById
} from "../models/inventoryreceived.model.js";

export async function getInventoryReceived(req, res) {
  try {
    const inventoryReceived = await getAllInventoryReceived();

    res.status(200).json({
      success: true,
      data: inventoryReceived
    });
  } catch (error) {
    console.error("Error fetching inventory received:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory received"
    });
  }
}

export async function getInventoryReceivedByIdController(req, res) {
  try {
    const { id } = req.params;

    const inventory = await getInventoryReceivedById(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory received record not found"
      });
    }

    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error("Error fetching inventory received record:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory received record"
    });
  }
}