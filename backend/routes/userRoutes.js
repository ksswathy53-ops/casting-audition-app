





const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

const {
  getCurrentUser,
  uploadIntroVideo,
  getTalentProfile,
  uploadAvatar,
  deleteMyAccount,
  getDirectorProfile,
} = require("../controllers/userController");

// USER ROUTES 

// Get current logged-in user
router.get("/me", authMiddleware, getCurrentUser);

// Upload intro video (Talent only)
router.post(
  "/upload-intro",
  authMiddleware,
  authorize("talent"),
  upload.single("video"),
  uploadIntroVideo
);

// Upload avatar/profile picture (Any logged-in user)
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

// Director views Talent profile (Director only)
router.get(
  "/talent/:talentId", //   params to  frontend
  authMiddleware,
  authorize("director"),
  getTalentProfile
);

// Talent views Director profile (Talent only)
router.get(
  "/director/:id",
  authMiddleware,
  authorize("talent"),
  getDirectorProfile
);

// Delete logged-in account (Talent or Director)
router.delete("/me", authMiddleware, deleteMyAccount);

module.exports = router;
