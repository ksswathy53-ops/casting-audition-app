

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const authorize = require("../middlewares/authorize");
const authMiddleware = require("../middlewares/auth");

const {
  applyForCasting,
  getApplicationsForCasting,
  updateApplicationStatus,
  getMyApplications,
  uploadPortfolio,
  getIncomingApplications,
  deleteApplication,
  updateMyApplication,
} = require("../controllers/applicationController");

//  TALENT ROUTES 

// Apply for casting
router.post("/apply", authMiddleware, authorize("talent"), applyForCasting);

// Talent: View My Applications
router.get("/my-applications", authMiddleware, authorize("talent"), getMyApplications);

// Talent: Delete (withdraw) application
router.delete("/:id", authMiddleware, authorize("talent"), deleteApplication);

// Talent: Edit application (only pending)
router.patch("/:id", authMiddleware, authorize("talent"), updateMyApplication);

// Upload portfolio (image / pdf / video)
router.post(
  "/upload-portfolio",
  authMiddleware,
  authorize("talent"),
  upload.single("file"),
  uploadPortfolio
);

//  DIRECTOR ROUTES 

// View applications for a casting
router.get(
  "/casting/:castingId",
  authMiddleware,
  authorize("director"),
  getApplicationsForCasting
);

// Update application status (shortlist / reject)
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("director"),
  updateApplicationStatus
);

// View all incoming applications
router.get(
  "/incoming-applications",
  authMiddleware,
  authorize("director"),
  getIncomingApplications
);

module.exports = router;



