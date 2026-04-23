import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { registerValidation, loginValidation } from "./auth.validation.js";

const router = express.Router();

import {
  loginLimiter,
  registerLimiter,
} from "../../middlewares/rateLimiter/authLimiter.js";

import {
  registerController,
  loginController,
  logoutController,
} from "../../modules/auth/auth.controller.js";

router.post(
  "/register",
  registerLimiter,
  registerValidation,
  validate,
  registerController
);
router.post("/login", loginLimiter, loginValidation, validate, loginController);
router.post("/logout", logoutController);

export default router;
