import express from "express";
import StudentRoutes from "./src/routes/Student.routes.js";
const app = express();
app.use(express.json());
app.use("/students",StudentRoutes);
const PORT = 4000;
app.listen(PORT,()=>{
    console.log(`Server running on port:${PORT}`);
});