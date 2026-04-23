import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.js";

import { getRecruiterDashboardService } from "./dashboard.service.js";

export const getRecruiterDashboard = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;

  const data = await getRecruiterDashboardService(recruiterId);

  res.status(200).json({
    success: true,
    data,
  });
});
