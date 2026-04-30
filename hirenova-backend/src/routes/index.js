import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import jobRoutes from "../modules/job/job.routes.js";
import applicationRoutes from "../modules/application/application.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);

export default router;
