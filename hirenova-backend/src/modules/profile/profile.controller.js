import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
  getProfileService,
  createProfileService,
  updateProfileService,
  uploadResumeService,
} from "./profile.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { calculateProfileCompletion } from "./profileCompletion.js";

export const getProfileController = asyncHandler(async (req, res) => {
  const profile = await getProfileService(req.user.id);
  const completion = calculateProfileCompletion(profile);

  return res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", {
      profile,
      completion,
    }),
  );
});

export const createMyProfileController = asyncHandler(async (req, res) => {
  const profile = await createProfileService(req.user.id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Profile created successfully", profile));
});

export const updateMyProfileController = asyncHandler(async (req, res) => {
  const profile = await updateProfileService(req.user.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", profile));
});

export const uploadResumeController = asyncHandler(async (req, res) => {
  const profile = await uploadResumeService(req.user.id, req.file);

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume uploaded successfully", profile));
});

export const getResumeController = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile?.resume?.url) {
    throw new ApiError(404, "No resume found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume fetched successfully", profile.resume));
});

export const deleteResumeController = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile?.resume?.publicId) {
    throw new ApiError(404, "No resume to delete");
  }

  await cloudinary.uploader.destroy(profile.resume.publicId, {
    resource_type: "raw",
  });

  profile.resume = {
    url: "",
    publicId: "",
    fileName: "",
    uploadedAt: null,
  };

  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume deleted successfully", null));
});
