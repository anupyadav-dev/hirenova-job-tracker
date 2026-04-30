import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
  getAllUsersService,
  getAllJobsService,
  getAllRecruitersService,
  deleteJobService,
  updateUserStatusService,
} from "./admin.service.js";


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  res.status(200).json({
    success: true,
    users,
  });
});


export const getAllRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await getAllRecruitersService();

  res.status(200).json({
    success: true,
    recruiters,
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
  await deleteJobService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});


export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await updateUserStatusService(
    req.params.userId,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "User status updated",
    user,
  });
});
