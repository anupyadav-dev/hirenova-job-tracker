import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { getProfileService } from "./user.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getProfileController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await getProfileService(userId);

  res.status(200).json(new ApiResponse(200, "User fetched", user));
});
