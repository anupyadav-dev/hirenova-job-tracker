const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler.util");

exports.registerController = asyncHandler(async (req, res) => {
  const { user } = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

exports.loginController = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: "User login successfully",
    data: user,
  });
});

exports.getProfileController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await authService.getProfile(userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.logoutController = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
