import {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder
} from "../models/purchaseorder.model.js";

export async function getPurchaseOrders(req, res) {
  try {
    const purchaseOrders = await getAllPurchaseOrders();

    res.status(200).json({
      success: true,
      data: purchaseOrders
    });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase orders"
    });
  }
}

export async function getPurchaseOrder(req, res) {
  try {
    const { id } = req.params;

    const purchaseOrder = await getPurchaseOrderById(id);

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    console.error("Error fetching purchase order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase order"
    });
  }
}
export async function createPurchaseOrderController(req, res) {
  try {
    const purchaseOrder = await createPurchaseOrder(req.body);

    res.status(201).json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    console.error("Error creating purchase order:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}