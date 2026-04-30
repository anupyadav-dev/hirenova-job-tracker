import {
  getMeService,
  getAllUsersService,
  updateUserStatusService,
} from "./user.service.js";

import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getMeController = asyncHandler(async (req, res) => {
  const user = await getMeService(req.user._id);

  res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

export const getAllUsersController = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

export const updateUserStatusController = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const user = await updateUserStatusService(req.params.id, status);

  res.status(200).json(new ApiResponse(200, "User status updated", user));
});
