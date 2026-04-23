import User from "./user.model.js";
import { ApiError } from "../../utils/apiError.js";

export const getProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
