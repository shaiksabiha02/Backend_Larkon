import {
  getAllPurchaseReturns,
  getPurchaseReturnById,
  createPurchaseReturn
} from "../models/purchasereturn.model.js";

export async function getPurchaseReturns(req, res) {
  try {
    const purchaseReturns = await getAllPurchaseReturns();

    res.status(200).json({
      success: true,
      data: purchaseReturns
    });
  } catch (error) {
    console.error("Error fetching purchase returns:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase returns"
    });
  }
}

export async function getPurchaseReturn(req, res) {
  try {
    const { id } = req.params;

    const purchaseReturn = await getPurchaseReturnById(id);

    if (!purchaseReturn) {
      return res.status(404).json({
        success: false,
        message: "Purchase return not found"
      });
    }

    res.status(200).json({
      success: true,
      data: purchaseReturn
    });
  } catch (error) {
    console.error("Error fetching purchase return:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase return"
    });
  }
}
export async function createPurchaseReturnController(req, res) {
  try {
    const { id } = req.params;

    const purchaseReturn = await createPurchaseReturn({
      ...req.body,
      purchase_order_id: id
    });

    res.status(201).json({
      success: true,
      data: purchaseReturn
    });
  } catch (error) {
    console.error("Error creating purchase return:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}