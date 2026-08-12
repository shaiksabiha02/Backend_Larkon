import express from "express";

import purchaseOrderRoutes from "./src/routes/purchaseorder.routes.js";
import purchaseListRoutes from "./src/routes/purchaselist.routes.js";
import inventoryReceivedRoutes from "./src/routes/inventoryreceived.routes.js";
import purchaseReturnRoutes from "./src/routes/purchasereturn.routes.js";
import inventoryWarehouseRoutes from "./src/routes/inventorywarehouse.routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1", purchaseOrderRoutes);
app.use("/api/v1", purchaseListRoutes);
app.use("/api/v1", inventoryReceivedRoutes);
app.use("/api/v1", purchaseReturnRoutes);
app.use("/api/v1", inventoryWarehouseRoutes);
app.use("/api/v1", inventoryRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
