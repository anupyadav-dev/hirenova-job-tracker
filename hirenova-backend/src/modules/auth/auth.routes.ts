import { Router } from "express";

import {
  loginLimiter,
  registerLimiter,
} from "../../middlewares/rateLimiter/authLimiter.js";
import { validate } from "../../middlewares/validation.middleware.js";

import {
  loginController,
  logoutController,
  registerController,
} from "./auth.controller.js";
import { loginValidation, registerValidation } from "./auth.validation.js";

const router: Router = Router();

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
