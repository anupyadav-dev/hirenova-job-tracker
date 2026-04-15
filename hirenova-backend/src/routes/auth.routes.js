const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

const {
  registerController,
  loginController,
  logoutController,
  getProfileController,
} = require("../controllers/auth.controller");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", protect, getProfileController);
router.post("/logout", logoutController);

module.exports = router;
