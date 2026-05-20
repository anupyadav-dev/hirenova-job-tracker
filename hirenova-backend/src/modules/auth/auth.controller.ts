import type { RequestHandler } from "express";

import { cookieOptions } from "../../constants/cookieOptions.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

import {
  loginUserService,
  registerUserService,
  type LoginInput,
  type RegisterInput,
} from "./auth.service.js";

/**
 * Access-token cookie lifetime. Mirrors JWT_EXPIRES (default 1d / 24h).
 * Hard-coded here for now; will move into env.ts in a later cleanup.
 */
const ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;

export const registerController: RequestHandler = asyncHandler(
  async (req, res) => {
    // Validation middleware has already enforced the RegisterInput shape;
    // the cast bridges the gap between Express's `any`-typed body and our
    // typed service contract. (When Zod lands in a later phase, this `as`
    // becomes a real parse and disappears.)
    const { user } = await registerUserService(req.body as RegisterInput);

    res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", user));
  },
);

export const loginController: RequestHandler = asyncHandler(
  async (req, res) => {
    const { user, token } = await loginUserService(req.body as LoginInput);

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "User login successfully", user));
  },
);

export const logoutController: RequestHandler = asyncHandler(
  async (_req, res) => {
    res.clearCookie("token", cookieOptions);
    res.status(200).json(new ApiResponse(200, "Logged out successfully"));
  },
);
