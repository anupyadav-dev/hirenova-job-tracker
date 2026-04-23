import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
  getMyProfileService,
  createProfileService,
  updateProfileService,
} from "./profile.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getProfileController = asyncHandler(async (req, res) => {
  const profile = await getMyProfileService(req.user.id);

  res.json({
    success: true,
    data: profile,
  });
});

export const createMyProfileController = asyncHandler(async (req, res) => {
  const profile = await createProfileService(req.user.id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Profile created successfully", profile));
});

export const updateMyProfileController = asyncHandler(async (req, res) => {
  const profile = await updateProfileService(req.user.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", profile));
});
