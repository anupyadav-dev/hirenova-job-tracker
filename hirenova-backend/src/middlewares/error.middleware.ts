import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import multer from "multer";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

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
 * Strategy:
 *   1. Translate known error classes into 4xx responses with safe messages.
 *   2. Treat anything unrecognized as an unexpected 500 — never leak internals.
 *   3. Stack traces only included when not running in production.
 *
 * Note the four-argument signature — Express identifies error middleware by
 * arity. Removing `_next` (even if unused) breaks Express's dispatch.
 */
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // In non-prod, log the full error for debugging; in prod, log only what's
  // safe (no stack with secrets). A proper logger lands in a later phase.
  if (env.NODE_ENV !== "production") {
    console.error("[error]", err);
  }

  // 1) Our own ApiError — already shaped correctly.
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // 2) Multer (file upload) errors — always 400.
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      message: getMulterMessage(err),
    });
    return;
  }

  // 3) Mongoose validation error — schema-level failure, treat as 400.
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // 4) Mongo duplicate key (E11000). Native driver error — narrow via shape.
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  ) {
    res.status(400).json({
      success: false,
      message: "Duplicate field value",
    });
    return;
  }

  // 5) Stray JWT errors that didn't go through `protect`.
  if (err instanceof jwt.TokenExpiredError) {
    res.status(401).json({ success: false, message: "Token expired" });
    return;
  }
  if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  // 6) Unknown error — never leak internals to the client.
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;
