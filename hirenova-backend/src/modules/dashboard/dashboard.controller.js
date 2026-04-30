import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
  getRecruiterDashboardService,
  getAdminDashboardService,
} from "./dashboard.service.js";

export const getRecruiterDashboard = asyncHandler(async (req, res) => {
  const data = await getRecruiterDashboardService(req.user.id);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await getAdminDashboardService();

  res.status(200).json({
    success: true,
    data,
  });
});
