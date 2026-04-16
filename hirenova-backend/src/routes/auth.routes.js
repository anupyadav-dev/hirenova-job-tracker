const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validation");

const {
  loginLimiter,
  registerLimiter,
} = require("../middleware/rateLimiter/authLimiter");

const {
  registerController,
  loginController,
  logoutController,
  getProfileController,
} = require("../controllers/auth.controller");

router.post(
  "/register",
  registerLimiter,
  registerValidation,
  validate,
  registerController
);
router.post("/login", loginLimiter, loginValidation, validate, loginController);
router.get("/me", protect, getProfileController);
router.post("/logout", logoutController);

module.exports = router;
