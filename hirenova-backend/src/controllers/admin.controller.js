const adminService = require("../services/admin.service");
const asyncHandler = require("../utils/asyncHandler.util");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();

  res.status(200).json({
    success: true,
    users,
  });
});
