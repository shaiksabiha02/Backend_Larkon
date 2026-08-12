import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./src/config/db.js";

import productRoutes from "./src/routes/Product.route.js";
import categoryRoutes from "./src/routes/Category.routes.js";
import attributeRoutes from "./src/routes/Attribute.routes.js";
import ReviewRoutes from "./src/routes/Review.routes.js";
import CouponsRoutes from "./src/routes/Coupons.routes.js";

dotenv.config();

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Uploads
app.use("/api/v1/uploads", express.static("uploads"));


// Product APIs
app.use("/api/v1/products", productRoutes);


// Category APIs
app.use("/api/v1/categories", categoryRoutes);


// Attribute APIs
app.use("/api/v1/attributes", attributeRoutes);


// Reviews APIs
app.use("/api/v1/reviews", ReviewRoutes);


// Coupons APIs
app.use("/api/v1/coupons", CouponsRoutes);


// Home
app.get("/api/v1", (req, res) => {
    res.send("Backend Server Running...");
});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
