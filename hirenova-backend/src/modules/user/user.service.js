import User from "./user.model.js";
import { ApiError } from "../../utils/apiError.js";

export const getMeService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const getAllUsersService = async () => {
  const users = await User.find().select("-password");

  return users;
};

export const updateUserStatusService = async (userId, status) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.status = status;

  await user.save();

  return user;
};
