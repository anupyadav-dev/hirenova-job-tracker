const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler.util");

exports.register = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: data.user,
    token: data.token,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body);
  res.status(201).json({
    success: true,
    message: "User login successfully",
    user: data.userOjb,
    token: data.token,
  });
});
