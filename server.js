import "dotenv/config";

import express from "express";
import cors from "cors";

import customerRoutes from "./src/routes/customerRoutes.js";
import sellerRoutes from "./src/routes/sellerRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Customer APIs
app.use("/api/v1/customers", customerRoutes);

// Seller APIs
app.use("/api/v1/sellers", sellerRoutes);

// Notification APIs
app.use("/api/v1/notifications", notificationRoutes);

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend server is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});