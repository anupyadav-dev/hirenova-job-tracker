import express from "express";

import {
  registerController,
  loginController,
  logoutController,
} from "./auth.controller.js";

import { validate } from "../../middlewares/validation.middleware.js";
import { registerValidation, loginValidation } from "./auth.validation.js";

import {
  loginLimiter,
  registerLimiter,
} from "../../middlewares/rateLimiter/authLimiter.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  registerValidation,
  validate,
  registerController,
);

router.post("/login", loginLimiter, loginValidation, validate, loginController);

router.post("/logout", logoutController);

export default router;
