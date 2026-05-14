import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { USER_STATUSES, type UserStatus } from "./user.model.js";
import {
  getAllUsersService,
  getMeService,
  updateUserStatusService,
} from "./user.service.js";

export const getMeController = asyncHandler(async (req, res) => {
  // `protect` middleware sets req.user; defense-in-depth narrow it here so
  // a missing-middleware misconfiguration cannot crash with `_id of undefined`.
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const user = await getMeService(req.user._id);

  res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

export const getAllUsersController = asyncHandler(async (_req, res) => {
  const users = await getAllUsersService();
  res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

/**
 * Type guard: narrows an unknown value to UserStatus.
 * Until Phase 1 Step 4 (validation architecture) lands a real validator,
 * we narrow req.body fields manually at the controller boundary.
 */
const isUserStatus = (value: unknown): value is UserStatus =>
  typeof value === "string" &&
  (USER_STATUSES as readonly string[]).includes(value);

export const updateUserStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string" || id.length === 0) {
    throw new ApiError(400, "Missing user id");
  }

  const { status } = req.body as { status?: unknown };
  if (!isUserStatus(status)) {
    throw new ApiError(
      400,
      `Invalid status; must be one of ${USER_STATUSES.join(", ")}`,
    );
  }

  const user = await updateUserStatusService(id, status);

  res.status(200).json(new ApiResponse(200, "User status updated", user));
});
