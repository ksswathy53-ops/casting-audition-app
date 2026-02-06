




const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const {
  createCasting,
  getAllCastings,
  getCastingById,
  getMyCastings,
  deleteCasting, // DELETE Casting (Director)
  updateCasting, // EDIT/UPDATE Casting (Director)
} = require("../controllers/castingController");

//  PUBLIC ROUTES 
router.get("/", getAllCastings);

//  PROTECTED ROUTES 
// Director-only routes
router.get("/my-castings", authMiddleware, authorize("director"), getMyCastings);
router.post("/create", authMiddleware, authorize("director"), createCasting);

// Delete a casting by ID (Director only)
router.delete("/:id", authMiddleware, authorize("director"), deleteCasting);

// Update a casting by ID (Director only)
router.patch("/:id", authMiddleware, authorize("director"), updateCasting);

//  DYNAMIC ROUTE 
// Get single casting by ID (accessible by all logged-in users)
router.get("/:id", getCastingById);

module.exports = router;





