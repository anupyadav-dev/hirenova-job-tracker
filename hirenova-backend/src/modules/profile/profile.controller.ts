import type { RequestHandler } from "express";

import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

import { calculateProfileCompletion } from "./profileCompletion.js";
import {
  createProfileService,
  getProfileService,
  updateProfileService,
  type ProfileInput,
} from "./profile.service.js";
import {
  deleteAvatarService,
  deleteResumeService,
  uploadAvatarService,
  uploadResumeService,
} from "./profileUpload.service.js";
import { Profile } from "./profile.model.js";

export const getProfileController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    // Use _id (always present) not id (optional alias on AuthedUser).
    const profile = await getProfileService(req.user._id);
    const completion = calculateProfileCompletion(profile);

    return res.status(200).json(
      new ApiResponse(200, "Profile fetched successfully", {
        profile,
        completion,
      }),
    );
  },
);

export const createMyProfileController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const profile = await createProfileService(
      req.user._id,
      req.body as ProfileInput,
    );

    return res
      .status(201)
      .json(new ApiResponse(201, "Profile created successfully", profile));
  },
);

export const updateMyProfileController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const profile = await updateProfileService(
      req.user._id,
      req.body as ProfileInput,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile updated successfully", profile));
  },
);

export const uploadResumeController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const profile = await uploadResumeService(req.user._id, req.file);

    return res
      .status(200)
      .json(new ApiResponse(200, "Resume uploaded successfully", profile));
  },
);

export const getResumeController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile?.resume?.url) {
      // Bug fixed: original JS used ApiError without importing it, causing
      // a ReferenceError at runtime whenever this branch was hit.
      throw new ApiError(404, "No resume found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Resume fetched successfully", profile.resume),
      );
  },
);

export const deleteResumeController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    await deleteResumeService(req.user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Resume deleted successfully", null));
  },
);

export const uploadAvatarController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const profile = await uploadAvatarService(req.user._id, req.file);

    return res
      .status(200)
      .json(new ApiResponse(200, "Avatar uploaded successfully", profile));
  },
);

export const deleteAvatarController: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    await deleteAvatarService(req.user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Avatar deleted successfully", null));
  },
);
