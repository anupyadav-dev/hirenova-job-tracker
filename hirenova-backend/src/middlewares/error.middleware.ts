import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import multer from "multer";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { logger } from "../shared/logger/logger.js";

/**
 * Maps Multer error codes to user-facing messages.
 */
const getMulterMessage = (err: multer.MulterError): string => {
  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return "File too large";
    case "LIMIT_UNEXPECTED_FILE":
      return "Unexpected file field";
    default:
      return err.message;
  }
};

/**
 * Centralized error handler. Mounted last in app.ts so every error from any
 * route ends up here (forwarded via asyncHandler / next(err)).
 *
 * STRATEGY — normalize, then log, then respond:
 *   1. Walk each known error class and derive `statusCode` + `message`.
 *      A single else-if chain keeps the logic linear and easy to extend.
 *   2. Log with the right pino level:
 *        • 5xx (server bugs)     → logger.error  — always, even in prod
 *        • 4xx (client mistakes) → logger.warn   — dev only; not production noise
 *   3. Respond with the normalized shape — no stack, no internals.
 *
 * WHY NOT LOG INSIDE EACH BRANCH?
 * Inline logging means duplicating the level-selection logic (error vs warn)
 * in every branch. The normalize-first approach keeps it in one place.
 *
 * Note the four-argument signature — Express identifies error middleware by
 * arity. Removing `_next` (even if unused) breaks Express's dispatch.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // ─── Step 1: normalize ──────────────────────────────────────────────────────
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = getMulterMessage(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    // Mongoose schema-level validation failure.
    statusCode = 400;
    message = err.message;
  } else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  ) {
    // Mongo duplicate-key error (E11000) — native driver, no class to instanceof.
    statusCode = 400;
    message = "Duplicate field value";
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token expired";
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid token";
  }
  // Anything else keeps the defaults: 500 / "Internal server error"

  // ─── Step 2: structured logging ─────────────────────────────────────────────
  //
  // 5xx = server-side bugs → always log (including production); alert on these.
  // 4xx = client-sent bad input → log only in dev (production noise suppressed).
  //
  // req.method + req.path give just enough context to locate the offending
  // route in logs without logging the full request body (which may contain PII).
  if (statusCode >= 500) {
    logger.error(
      { err, method: req.method, path: req.path },
      "Server error",
    );
  } else if (env.NODE_ENV !== "production") {
    logger.warn(
      { statusCode, message, method: req.method, path: req.path },
      "Client error",
    );
  }

  // ─── Step 3: respond ────────────────────────────────────────────────────────
  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
