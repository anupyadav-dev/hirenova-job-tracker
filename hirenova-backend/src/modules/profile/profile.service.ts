import { ApiError } from "../../utils/apiError.js";

import { Profile } from "./profile.model.js";
import type { ProfileDocument } from "./profile.model.js";
import type { ProfileInput } from "./profile.schemas.js";

// Re-export so profile.controller.ts imports from one place.
export type { ProfileInput };

// NOTE: normalizeSkills was removed here.
// Previously it converted "react,node" → ["react","node"] inside the service.
// Now zodValidate(profileSchema) runs at the route level and performs the same
// split via the z.union transform. By the time any service function is called,
// skills is always string[] (or undefined). Keeping the normalization in two
// places would be confusing — the route layer is the correct boundary for it.

// ─── Services ─────────────────────────────────────────────────────────────────

export const getProfileService = async (
  userId: string,
): Promise<ProfileDocument> => {
  const profile = await Profile.findOne({
    user: userId,
  }).populate("user", "name email role");

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

export const createProfileService = async (
  userId: string,
  data: ProfileInput,
): Promise<ProfileDocument> => {
  const existing = await Profile.findOne({ user: userId });

  if (existing) {
    throw new ApiError(400, "Profile already exists");
  }

  const profile = await Profile.create({
    user: userId,
    bio: data.bio ?? "",
    experience: data.experience ?? "",
    phone: data.phone ?? "",
    // skills is always string[] here — Zod's union transform already
    // converted any comma-separated string before this point.
    skills: data.skills ?? [],
  });

  return profile;
};

export const updateProfileService = async (
  userId: string,
  data: ProfileInput,
): Promise<ProfileDocument> => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  if (data.bio !== undefined) profile.bio = data.bio;
  if (data.phone !== undefined) profile.phone = data.phone;
  if (data.experience !== undefined) profile.experience = data.experience;
  if (data.skills !== undefined) {
    // Already string[] — no further normalization needed.
    profile.skills = data.skills;
  }

  await profile.save();

  return profile;
};
