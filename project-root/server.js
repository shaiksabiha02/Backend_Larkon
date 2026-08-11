import express from "express";
import ReviewRoutes from "./src/routes/Review.routes.js";
import CouponsRoutes from "./src/routes/Coupons.routes.js";
const app = express();
app.use(express.json());
app.use("/api/v1/reviews",ReviewRoutes);
app.use("/api/v1/coupons",CouponsRoutes);
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

