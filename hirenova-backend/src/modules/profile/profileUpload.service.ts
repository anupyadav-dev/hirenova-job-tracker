import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

import { ApiError } from "../../utils/apiError.js";
import cloudinary from "../../utils/cloudinary.js";

import { Profile } from "./profile.model.js";
import type { ProfileDocument } from "./profile.model.js";

// ─── Cloudinary helpers ───────────────────────────────────────────────────────

const uploadResumeToCloudinary = (
  buffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hirenova/resume", resource_type: "raw" },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) return reject(error);
        // When no error, Cloudinary guarantees result is present.
        resolve(result!);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadAvatarToCloudinary = (
  buffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hirenova/avatar",
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto" },
        ],
      },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) return reject(error);
        resolve(result!);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ─── Shared helper ───────────────────────────────────────────────────────────

export const findProfileOrFail = async (
  userId: string,
): Promise<ProfileDocument> => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

// ─── Services ─────────────────────────────────────────────────────────────────

export const uploadResumeService = async (
  userId: string,
  file: Express.Multer.File | undefined,
): Promise<ProfileDocument> => {
  if (!file) {
    throw new ApiError(400, "Resume file is required");
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new ApiError(400, "Only PDF/DOC/DOCX allowed");
  }

  const profile = await findProfileOrFail(userId);

  if (profile.resume?.publicId) {
    await cloudinary.uploader.destroy(profile.resume.publicId, {
      resource_type: "raw",
    });
  }

  const result = await uploadResumeToCloudinary(file.buffer);

  profile.resume = {
    url: result.secure_url,
    publicId: result.public_id,
    fileName: file.originalname,
    uploadedAt: new Date(),
  };

  await profile.save();

  return profile;
};

export const deleteResumeService = async (
  userId: string,
): Promise<ProfileDocument> => {
  const profile = await findProfileOrFail(userId);

  if (!profile.resume?.publicId) {
    throw new ApiError(404, "No resume found");
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

  return profile;
};

export const uploadAvatarService = async (
  userId: string,
  file: Express.Multer.File | undefined,
): Promise<ProfileDocument> => {
  if (!file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new ApiError(400, "Only JPG PNG WEBP allowed");
  }

  const profile = await findProfileOrFail(userId);

  if (profile.profileImage?.publicId) {
    await cloudinary.uploader.destroy(profile.profileImage.publicId);
  }

  const result = await uploadAvatarToCloudinary(file.buffer);

  profile.profileImage = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await profile.save();

  return profile;
};

export const deleteAvatarService = async (
  userId: string,
): Promise<ProfileDocument> => {
  const profile = await findProfileOrFail(userId);

  if (!profile.profileImage?.publicId) {
    throw new ApiError(404, "Avatar not found");
  }

  await cloudinary.uploader.destroy(profile.profileImage.publicId);

  profile.profileImage = {
    url: "",
    publicId: "",
  };

  await profile.save();

  return profile;
};
