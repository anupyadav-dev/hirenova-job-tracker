const express = require("express");
const router = express();
const jobController = require("../controllers/job.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/", protect, authorize("recruiter"), jobController.createJob);
router.get(
  "/my-jobs",
  protect,
  authorize("recruiter"),
  jobController.getMyJobs
);
router.get(
  "/recommended",
  protect,
  authorize("user"),
  jobController.getRecommendedJobs
);
router.get("/", jobController.getJobs);

router.get("/:id", jobController.getJobById);
router.delete("/:id", protect, authorize("recruiter"), jobController.deleteJob);

module.exports = router;
