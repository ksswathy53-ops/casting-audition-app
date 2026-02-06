


const Casting = require("../db/models/castingSchema");
const Application = require("../db/models/applicationSchema");

//  CREATE CASTING 
exports.createCasting = async (req, res) => {
  try {
    const {
      title,
      description,
      roleType,
      ageRange,
      gender,
      location,
      auditionDate,
    } = req.body;

    if (!title || !description || !roleType || !location || !auditionDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const casting = await Casting.create({
      title,
      description,
      roleType,
      ageRange,
      gender,
      location,
      auditionDate,
      postedBy: req.user.id,
      isActive: true, 
    });

    return res.status(201).json({
      message: "Casting created successfully",
      casting,
    });
  } catch (error) {
    console.error("createCasting ERROR:", error);
    return res.status(500).json({
      message: "Server error while creating casting",
    });
  }
};

//  GET SINGLE CASTING 
exports.getCastingById = async (req, res) => {
  try {
    const casting = await Casting.findOne({
      _id: req.params.id,
      isActive: true, 
    }).populate("postedBy", "name email role avatar");

    if (!casting) {
      return res.status(404).json({
        message: "Casting not found or no longer available",
      });
    }

    return res.status(200).json(casting);
  } catch (error) {
    console.error("getCastingById ERROR:", error);
    return res.status(500).json({
      message: "Server error while fetching casting",
    });
  }
};

//  GET ALL CASTINGS (Talent )
exports.getAllCastings = async (req, res) => {
  try {
    const { search, roleType, location } = req.query;

    let query = { isActive: true }; // active castings

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { roleType: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (roleType) query.roleType = roleType;
    if (location) query.location = location;

    const castings = await Casting.find(query)
      .populate("postedBy", "name email role avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(castings);
  } catch (error) {
    console.error("getAllCastings ERROR:", error);
    return res.status(500).json({
      message: "Server error while fetching castings",
    });
  }
};

//  GET MY CASTINGS (Director )
exports.getMyCastings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "director") {
      return res.status(403).json({ message: "Access denied" });
    }

    //  Director sees bth active & inactive
    const castings = await Casting.find({
      postedBy: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(castings);
  } catch (error) {
    console.error("getMyCastings ERROR:", error);
    return res.status(500).json({
      message: "Server error while fetching your castings",
    });
  }
};

//  DELETE CASTING (SOFT DELETE)
exports.deleteCasting = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const casting = await Casting.findById(req.params.id);
    if (!casting) {
      return res.status(404).json({ message: "Casting not found" });
    }

    if (casting.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //  SOFT DELETE
    casting.isActive = false;
    casting.deletedAt = new Date();
    await casting.save();

    return res.status(200).json({
      message: "Casting deleted successfully",
    });
  } catch (error) {
    console.error("deleteCasting ERROR:", error);
    return res.status(500).json({
      message: "Server error while deleting casting",
    });
  }
};

//  UPDATE CASTING 
exports.updateCasting = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const casting = await Casting.findById(id);
    if (!casting) {
      return res.status(404).json({ message: "Casting not found" });
    }

    if (casting.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //  Prevent updates on deltd castings
    if (!casting.isActive) {
      return res.status(400).json({
        message: "Cannot update a deleted casting",
      });
    }

    const applicationsCount = await Application.countDocuments({
      casting: casting._id,
    });

    const allowedFields = [
      "title",
      "description",
      "roleType",
      "ageRange",
      "gender",
      "location",
      "auditionDate",
      "updateNote",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        casting[field] = updates[field];
      }
    });

    if (applicationsCount > 0) {
      casting.isUpdated = true;
      casting.lastUpdatedAt = new Date();
      casting.updateNote =
        updates.updateNote ||
        "Casting details were updated after you applied";
    }

    await casting.save();

    return res.status(200).json({
      message: "Casting updated successfully",
      casting,
    });
  } catch (error) {
    console.error("updateCasting ERROR:", error);
    return res.status(500).json({
      message: "Server error while updating casting",
    });
  }
};
