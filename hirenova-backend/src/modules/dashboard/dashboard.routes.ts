import { Router } from "express";

import { authorize, protect } from "../../middlewares/auth.middleware.js";

import {
  getAdminDashboard,
  getRecruiterDashboard,
} from "./dashboard.controller.js";

const router: Router = Router();

router.get(
  "/recruiter",
  protect,
  authorize("recruiter"),
  getRecruiterDashboard,
);

router.get("/admin", protect, authorize("admin"), getAdminDashboard);

export default router;
