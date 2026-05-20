import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import jobRoutes from "../modules/job/job.routes.js";
import applicationRoutes from "../modules/application/application.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";

// ─── API v1 manifest ─────────────────────────────────────────────────────────
// This file is the single source of truth for every URL prefix in the API.
// Adding a module here is the only thing required to wire it into the app.

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);

export default router;
