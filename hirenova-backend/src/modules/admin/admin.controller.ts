import type { RequestHandler } from "express";

import { asyncHandler } from "../../utils/asyncHandler.util.js";
import type { UserStatus } from "../user/user.model.js";

import {
  deleteJobService,
  getAllJobsService,
  getAllRecruitersService,
  getAllUsersService,
  updateUserStatusService,
} from "./admin.service.js";

export const getAllUsers: RequestHandler = asyncHandler(async (_req, res) => {
  const users = await getAllUsersService();

  res.status(200).json({
    success: true,
    users,
  });
});

export const getAllRecruiters: RequestHandler = asyncHandler(
  async (_req, res) => {
    const recruiters = await getAllRecruitersService();

    res.status(200).json({
      success: true,
      recruiters,
    });
  },
);

export const getAllJobs: RequestHandler = asyncHandler(async (_req, res) => {
  const jobs = await getAllJobsService();

  res.status(200).json({
    success: true,
    jobs,
  });
});

export const deleteJob: RequestHandler = asyncHandler(async (req, res) => {
  // @types/express@5 widens param values to `string | string[]`.
  // Route params (`:id`) are always plain strings — cast is safe.
  await deleteJobService(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

export const updateUserStatus: RequestHandler = asyncHandler(
  async (req, res) => {
    // req.body is untyped (Express `any`). Cast to UserStatus at this
    // boundary — when Zod validation lands this cast becomes a real parse.
    const user = await updateUserStatusService(
      req.params.userId as string, // see deleteJob note above
      req.body.status as UserStatus,
    );

    res.status(200).json({
      success: true,
      message: "User status updated",
      user,
    });
  },
);
