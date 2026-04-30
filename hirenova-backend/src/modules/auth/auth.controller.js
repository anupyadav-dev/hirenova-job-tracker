import { registerUserService, loginUserService } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { cookieOptions } from "../../constants/cookieOptions.js";

export const registerController = asyncHandler(async (req, res) => {
  const { user } = await registerUserService(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
});

export const loginController = asyncHandler(async (req, res) => {
  const { user, token } = await loginUserService(req.body);

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.status(200).json(new ApiResponse(200, "User login successfully", user));
});

export const logoutController = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});
