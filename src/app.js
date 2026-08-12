import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import todoRoutes from "./routes/todo.routes.js";
const app = express();
// MIDDLEWARES
app.use(cors());
app.use(express.json());
// DEBUG LOGS
app.use((req, res, next) => {
    console.log("=================================");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("GLOBAL BODY:", req.body);
    console.log("=================================");

    next();
});
// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        message: "API Running"
    });
});
// CHAT ROUTES
app.use("/api/v1/chat", chatRoutes);
// TODO ROUTES
app.use("/api/v1/todos", todoRoutes);
export default app;