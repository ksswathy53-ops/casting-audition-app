



const express = require("express");
const router = express.Router();
const { register, login, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");

// PUBLIC ROUTES 
router.post("/register", register); // User registration
router.post("/login", login);       // User login

//  PROTECTED ROUTES 
// Only authenticated users can update profile
router.patch("/update-profile", authMiddleware, updateProfile);

module.exports = router;
