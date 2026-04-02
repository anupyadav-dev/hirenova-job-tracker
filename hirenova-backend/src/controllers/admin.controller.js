const adminService = require("../services/admin.service");
const asyncHandler = require("../utils/asyncHandler.util");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await adminService.getAllJobs();
  res.status(200).json({
    success: true,
    jobs,
  });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  await adminService.deleteJob(jobId);

  res.json({
    success: true,
    message: "Job deleted by admin",
  });
});

exports.getAllRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await adminService.getAllRecruiters();

  res.status(200).json({
    success: true,
    recruiters,
  });
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  const user = await adminService.updateUserStatus(userId, status);

  res.status(200).json({
    success: true,
    message: "User status updated",
    user,
  });
});

exports.getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getAdminDashboard();

  res.status(200).json({
    success: true,
    data,
  });
});
