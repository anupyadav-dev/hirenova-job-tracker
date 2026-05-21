import { ApiError } from "../../utils/apiError.js";
import User, { type UserDocument, type UserStatus } from "./user.model.js";

export const getMeService = async (userId: string): Promise<UserDocument> => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const getAllUsersService = async (): Promise<UserDocument[]> => {
  return User.find().select("-password");
};

export const updateUserStatusService = async (
  userId: string,
  status: UserStatus,
): Promise<UserDocument> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.status = status;
  await user.save();

  return user;
};
