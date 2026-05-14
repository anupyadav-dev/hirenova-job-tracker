import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import User from "../modules/user/user.model.js";
import type { UserRole } from "../modules/user/user.model.js";
import type { AuthedUser } from "../types/express.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import type { JwtUserPayload } from "../utils/token.util.js";

/**
 * Pulls the JWT from the `token` cookie, falling back to the
 * `Authorization: Bearer <token>` header.
 */
const extractToken = (req: Request): string | null => {
  if (req.cookies?.token) {
    return req.cookies.token as string;
  }
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length);
  }
  return null;
};

/**
 * Verifies the JWT and loads the user.
 * On success, attaches `req.user`. On failure, throws ApiError(401/403).
 */
export const protect: RequestHandler = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  let payload: JwtUserPayload;
  try {
    // `jwt.verify` returns `string | JwtPayload`. We trust our signer
    // (token.util.ts) to always include id+role — assert that contract here.
    payload = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token expired");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid token");
    }
    // Unknown error during JWT verification — surface as 401 rather than 500.
    throw new ApiError(401, "Invalid token");
  }

  const userDoc = await User.findById(payload.id).select("-password");
  if (!userDoc) {
    throw new ApiError(401, "User not found");
  }
  if (userDoc.status === "blocked") {
    throw new ApiError(403, "Your account has been blocked");
  }

  // Normalize the Mongoose Document into the AuthedUser shape declared in
  // src/types/express.d.ts. We map fields explicitly rather than assigning
  // the whole document — keeps `req.user` decoupled from Mongoose internals.
  const authedUser: AuthedUser = {
    _id: userDoc._id.toString(),
    id: userDoc._id.toString(),
    email: userDoc.email,
    name: userDoc.name,
    role: userDoc.role,
    status: userDoc.status,
  };

  req.user = authedUser;
  next();
});

/**
 * Role-based authorization. Apply *after* `protect`.
 *
 *   router.get("/admin", protect, authorize("admin"), handler)
 *
 * Variadic so callers can list any number of roles:
 *   authorize("admin", "recruiter")
 */
export const authorize =
  (...roles: readonly UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role (${req.user.role}) is not allowed to access this resource`,
      );
    }
    next();
  };
