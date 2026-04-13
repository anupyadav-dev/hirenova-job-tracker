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
