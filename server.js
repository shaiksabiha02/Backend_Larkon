import express from "express";
import pricingRoutes from "./src/routes/pricingRoutes.js";
import staticPagesRoutes from "./src/routes/staticPagesRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";



const app = express();

app.use(express.json());
app.use("/api/v1", invoiceRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1",pricingRoutes);
app.use("/api/v1", staticPagesRoutes);



app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
