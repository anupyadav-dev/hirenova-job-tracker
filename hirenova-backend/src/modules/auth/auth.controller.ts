import type { RequestHandler } from "express";

import { cookieOptions } from "../../config/cookieOptions.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

import { loginUserService, registerUserService } from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

/**
 * Access-token cookie lifetime. Mirrors JWT_EXPIRES (default 15 minutes).
 */
const ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;

export const registerController: RequestHandler = asyncHandler(
  async (req, res) => {
    // zodValidate(registerSchema) already ran before this controller.
    // req.body is now the PARSED value (trimmed, lowercased, defaults applied).
    // The cast is no longer blind — it is backed by runtime Zod validation.
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

    res.status(200).json(new ApiResponse(200, "User login successfully", user));
  },
);

export const logoutController: RequestHandler = asyncHandler(
  async (_req, res) => {
    res.clearCookie("token", cookieOptions);
    res.status(200).json(new ApiResponse(200, "Logged out successfully"));
  },
);
