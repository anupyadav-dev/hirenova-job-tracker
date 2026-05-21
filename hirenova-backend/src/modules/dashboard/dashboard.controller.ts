import type { RequestHandler } from "express";

import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

import {
  getAdminDashboardService,
  getRecruiterDashboardService,
} from "./dashboard.service.js";

export const getRecruiterDashboard: RequestHandler = asyncHandler(
  async (req, res) => {
    // Defense-in-depth: even though the route is mounted behind `protect`,
    // narrow `req.user` here so this controller is safe in isolation.
    // Augmented as optional in src/types/express.d.ts.
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const data = await getRecruiterDashboardService(req.user._id);

    res.status(200).json({
      success: true,
      data,
    });
  },
);

export const getAdminDashboard: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const data = await getAdminDashboardService();

    res.status(200).json({
      success: true,
      data,
    });
  },
);
