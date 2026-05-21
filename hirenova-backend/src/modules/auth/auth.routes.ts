import { Router } from "express";

import {
  loginLimiter,
  registerLimiter,
} from "../../middlewares/rateLimiter/authLimiter.js";
import { zodValidate } from "../../shared/validators/validate.middleware.js";

import {
  loginController,
  logoutController,
  registerController,
} from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";

const router: Router = Router();

// zodValidate(schema) replaces the [validationChain[], validate] pair.
// One middleware instead of two, and the parsed body is typed.
router.post("/register", registerLimiter, zodValidate(registerSchema), registerController);

router.post("/login", loginLimiter, zodValidate(loginSchema), loginController);

router.post("/logout", logoutController);

export default router;
