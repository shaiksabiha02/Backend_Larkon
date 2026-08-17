import swaggerUi from "swagger-ui-express";
import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { authenticate } from "./src/middlewares/auth.middleware.js";



// Reviews & Coupons
import reviewRoutes from "./src/routes/Review.routes.js";
import couponsRoutes from "./src/routes/Coupons.routes.js";

// Invoices, Pricing, Static Pages, Settings
import pricingRoutes from "./src/routes/pricingRoutes.js";
import staticPagesRoutes from "./src/routes/staticPagesRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";

// Cart & Orders
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/ordersRoutes.js";

// Customers, Sellers, Notifications
import customerRoutes from "./src/routes/customerRoutes.js";
import sellerRoutes from "./src/routes/sellerRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

// Products, Categories, Attributes
import productRoutes from "./src/routes/Product.route.js";
import categoryRoutes from "./src/routes/Category.routes.js";
import attributeRoutes from "./src/routes/Attribute.routes.js";

dotenv.config();

const app = express();




// ========================================
// Swagger Documentation
// ========================================

const swaggerDocument = JSON.parse(
    fs.readFileSync("./swagger-output.json", "utf-8")
);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

console.log("Swagger Docs: http://localhost:3000/api-docs");
// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Products
// ===============================

app.use("/api/v1/products", productRoutes);

// ===============================
// Categories
// ===============================

app.use("/api/v1/categories", categoryRoutes);


// Attributes


app.use("/api/v1/attributes", attributeRoutes);


// Reviews


app.use("/api/v1/reviews", reviewRoutes);

// Coupons


app.use("/api/v1/coupons", couponsRoutes);

// Cart


app.use("/api/v1/cart", cartRoutes);


// Orders


app.use("/api/v1/orders", orderRoutes);


// Customers


app.use("/api/v1/customers", customerRoutes);


// Sellers


app.use("/api/v1/sellers", sellerRoutes);


// Notifications


app.use("/api/v1/notifications", notificationRoutes);

// Settings


app.use("/api/v1/settings", settingsRoutes);


// Invoice APIs


app.use("/api/v1", invoiceRoutes);


// Pricing APIs


app.use("/api/v1", pricingRoutes);


// Static Pages APIs


app.use("/api/v1", staticPagesRoutes);


// Dashboard-analytics

import dashboardRoutes from "./src/routes/dashboard.routes.js";

app.use("/api/v1/dashboard", dashboardRoutes);



//user,Admin 
import rolePermissionRoutes from "./src/routes/RolePermission.routes.js";
import userRoutes from "./src/routes/User.routes.js";
import roleRoutes from "./src/routes/Role.routes.js";
import permissionRoutes from "./src/routes/Permission.routes.js";
import userRoleRoutes from "./src/routes/UserRole.routes.js";
import passwordResetRoutes from "./src/routes/PasswordReset.routes.js";
import refreshTokenRoutes from "./src/routes/RefreshToken.routes.js";
import loginHistoryRoutes from "./src/routes/LoginHistory.routes.js";
import userProfileRoutes from "./src/routes/UserProfile.routes.js";
import authRoutes from "./src/routes/Auth.routes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

// User Routes
app.use("/api/v1/users", userRoutes);

// Role Routes
app.use("/api/v1/roles", roleRoutes);

// Permission Routes
app.use("/api/v1/permissions", permissionRoutes);

// User Role Routes
app.use("/api/v1/user-roles", userRoleRoutes);

// Password Reset Routes
app.use("/api/v1/password-resets", passwordResetRoutes);

// Refresh Token Routes
app.use("/api/v1/refresh-tokens", refreshTokenRoutes);

// Login History Routes
app.use("/api/v1/login-history", loginHistoryRoutes);

// User Profile Routes
app.use("/api/v1/user-profiles", userProfileRoutes);

// Authentication Routes
app.use("/api/v1/auth", authRoutes);

// Admin Routes
app.use("/api/v1/admin", adminRoutes);

// Role Permission Routes
app.use("/api/v1/role-permissions", rolePermissionRoutes);




import http from "http";
//import app from "./src/app.js";
import pool from "./src/config/db.js";



//import dashboardRoutes from "./routes/dashboard.routes.js";
import mediaRoutes from "./src/routes/media.routes.js";
import searchRoutes from "./src/routes/search.routes.js";




// ========================================
// Static Uploads
// ========================================

app.use("/uploads", express.static("uploads"));

// ========================================
// Dashboard Routes
// ========================================

//app.use("/api/v1/dashboard", dashboardRoutes);

// ========================================
// Search Routes
// ========================================

app.use("/api/v1/search", searchRoutes);

// ========================================
// Media Routes
// ========================================

app.use("/api/v1/media", mediaRoutes);





// to do chat module

import { Server } from "socket.io";

import chatRoutes from "./src/routes/chat.routes.js";
import todoRoutes from "./src/routes/todo.routes.js";
import chatSocket from "./src/sockets/chat.socket.js";

import { up as chatUp } from "./src/migrations/chat.js";
import { up as todoUp } from "./src/migrations/todo.js";




// API Routes
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/todos", todoRoutes);

// HTTP Server
const server = http.createServer(app);

// Socket.IO Configuration
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.IO Events
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_conversation", (conversationId) => {
        socket.join(`conversation_${conversationId}`);

        console.log(
            `Socket ${socket.id} joined conversation ${conversationId}`
        );
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Make Socket.IO Available to Controllers
app.set("io", io);

// Initialize Chat Socket
chatSocket(io);


// Export Socket.IO Instance
export { io };


//Email and calender

import emailRoutes from './src/routes/emailRoutes.js';
import emailLabelRoutes from './src/routes/emailLabelRoutes.js';
import inboxRoutes from './src/routes/inboxRoutes.js';
import calendarRoutes from './src/routes/calendarRoutes.js';
import recipientsRoutes from './src/routes/recipientsRoutes.js';




// API Routes - Version 1

app.use('/api/v1/emails',authenticate, emailRoutes);
app.use('/api/v1/email-labels',authenticate, emailLabelRoutes);
app.use('/api/v1/inbox', authenticate,inboxRoutes);
app.use('/api/v1/calendar',authenticate, calendarRoutes);
app.use('/api/v1/recipients',authenticate, recipientsRoutes);



//inventory,warehouses

import purchaseOrderRoutes from "./src/routes/purchaseorder.routes.js";
import purchaseListRoutes from "./src/routes/purchaselist.routes.js";
import inventoryReceivedRoutes from "./src/routes/inventoryreceived.routes.js";
import purchaseReturnRoutes from "./src/routes/purchasereturn.routes.js";
import inventoryWarehouseRoutes from "./src/routes/inventorywarehouse.routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";


app.use("/api/v1",authenticate, purchaseOrderRoutes);
app.use("/api/v1", authenticate,purchaseListRoutes);
app.use("/api/v1", authenticate,inventoryReceivedRoutes);
app.use("/api/v1", authenticate,purchaseReturnRoutes);
app.use("/api/v1", authenticate,inventoryWarehouseRoutes);
app.use("/api/v1", authenticate,inventoryRoutes);



app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// Server


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
