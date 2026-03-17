const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/users", protect, authorize("admin"), adminController.getAllUsers);
router.get(
  "/recruiters",
  protect,
  authorize("admin"),
  adminController.getAllRecruiters
);

module.exports = router;
