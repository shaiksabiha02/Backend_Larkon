import {
  getAllInventoryWarehouses,
  getInventoryWarehouseById,
  createInventoryWarehouse,
  updateInventoryWarehouse
} from "../models/inventorywarehouse.model.js";

export async function getInventoryWarehouses(req, res) {
  try {
    const inventoryWarehouses = await getAllInventoryWarehouses();

    res.status(200).json({
      success: true,
      data: inventoryWarehouses
    });
  } catch (error) {
    console.error("Inventory Warehouse Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getInventoryWarehouse(req, res) {
  try {
    const { id } = req.params;

    const inventoryWarehouse = await getInventoryWarehouseById(id);

    if (!inventoryWarehouse) {
      return res.status(404).json({
        success: false,
        message: "Inventory warehouse not found"
      });
    }

    res.status(200).json({
      success: true,
      data: inventoryWarehouse
    });
  } catch (error) {
    console.error("Inventory Warehouse Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function createWarehouse(req, res) {
  try {
    const warehouse = await createInventoryWarehouse(req.body);

    res.status(201).json({
      success: true,
      data: warehouse
    });
  } catch (error) {
    console.error("Create Warehouse Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function updateWarehouse(req, res) {
  try {
    const { id } = req.params;

    const existingWarehouse = await getInventoryWarehouseById(id);

    if (!existingWarehouse) {
      return res.status(404).json({
        success: false,
        message: "Inventory warehouse not found"
      });
    }

    const warehouse = await updateInventoryWarehouse(id, req.body);

    res.status(200).json({
      success: true,
      data: warehouse
    });
  } catch (error) {
    console.error("Update Warehouse Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}