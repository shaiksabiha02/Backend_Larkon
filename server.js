import express from "express";
import dotenv from "dotenv";

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

dotenv.config();

const app = express();

app.use(express.json());

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});