// modules/profile/profile.service.js

import { Profile } from "./profile.model.js";
import { ApiError } from "../../utils/apiError.js";


export const getMyProfileService = async (userId) => {
  const profile = await Profile.findOne({ user: userId });

  return profile; 
};


export const createProfileService = async (userId, data) => {
  const exists = await Profile.findOne({ user: userId });

  if (exists) throw new ApiError(400, "Profile already exists");

  const profile = await Profile.create({
    user: userId,
    ...data,
  });

  return profile;
};


export const updateProfileService = async (userId, data) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId }, 
    { $set: data },
    { new: true }
  );

  if (!profile) throw new ApiError(404, "Profile not found");

  return profile;
};
