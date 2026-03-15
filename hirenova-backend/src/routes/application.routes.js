const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post(
  "/apply/:jobId",
  protect,
  authorize("user"),
  applicationController.applyJob
);

router.get(
  "/my-applications",
  protect,
  authorize("user"),
  applicationController.getMyApplications
);

router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter"),
  applicationController.getApplicants
);

router.patch(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  applicationController.updateApplicationStatus
);

module.exports = router;
