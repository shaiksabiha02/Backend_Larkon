import {
  getAllPurchaseLists,
  getPurchaseListById
} from "../models/purchaselist.model.js";

export async function getPurchaseLists(req, res) {
  try {
    const purchaseLists = await getAllPurchaseLists();

    res.status(200).json({
      success: true,
      data: purchaseLists
    });
  } catch (error) {
    console.error("Error fetching purchase lists:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase lists"
    });
  }
}

export async function getPurchaseList(req, res) {
  try {
    const { id } = req.params;

    const purchaseList = await getPurchaseListById(id);

    if (!purchaseList) {
      return res.status(404).json({
        success: false,
        message: "Purchase list not found"
      });
    }

    res.status(200).json({
      success: true,
      data: purchaseList
    });
  } catch (error) {
    console.error("Error fetching purchase list:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase list"
    });
  }
}