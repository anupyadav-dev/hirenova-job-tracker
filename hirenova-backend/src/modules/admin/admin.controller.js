import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import {
  getAllUsersService,
  getAllJobsService,
  deleteJobService,
  getAllRecruitersService,
  updateUserStatusService,
  getAdminDashboardService,
} from "./admin.service.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  res.status(200).json({
    success: true,
    users,
  });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await getAllJobsService();
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteJobService(id);

  res.json({
    success: true,
    message: "Job deleted by admin",
  });
});

export const getAllRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await getAllRecruitersService();

  res.status(200).json({
    success: true,
    recruiters,
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  const user = await updateUserStatusService(userId, status);

  res.status(200).json({
    success: true,
    message: "User status updated",
    user,
  });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await getAdminDashboardService();

  res.status(200).json({
    success: true,
    data,
  });
});
