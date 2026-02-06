

const User = require("../db/models/userSchema");
const Casting = require("../db/models/castingSchema");
const Application = require("../db/models/applicationSchema");

//  GET CURRENT USER 
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser ERROR:", error);
    res.status(500).json({ message: "Server error while fetching user" });
  }
};





//  UPLOAD INTRO VIDEO 
exports.uploadIntroVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video uploaded" });

    const user = await User.findById(req.user.id);
    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "User not found" });
    }

    user.introVideo = `uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Intro video uploaded successfully",
      introVideo: user.introVideo,
    });
  } catch (error) {
    console.error("uploadIntroVideo ERROR:", error);
    res.status(500).json({ message: "Server error while uploading video" });
  }
};





// TALENT PROFILE
exports.getTalentProfile = async (req, res) => {
  try {
    const talent = await User.findOne({
      _id: req.params.talentId,
      role: "talent",
      isActive: true,
    })
      .select("name email role introVideo avatar bio")
      .lean();

    if (!talent) return res.status(404).json({ message: "Talent not found" });

    // fetch all applications, mark if applicant is deleted
    const applications = await Application.find({ applicant: talent._id })
      .populate(
        "casting",
        "title roleType location auditionDate isActive updatedAt isUpdated updateNote lastUpdatedAt"
      )
      .select("status portfolioLink portfolioFile casting")
      .lean();

    const updatedApplications = applications.map(app => ({
      ...app,
      applicantDeleted: false, 
    }));

    res.status(200).json({ ...talent, applications: updatedApplications });
  } catch (error) {
    console.error("getTalentProfile ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




//  UPLOAD AVATAR
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const user = await User.findById(req.user.id);
    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = `uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      avatar: user.avatar,
      user,
    });
  } catch (error) {
    console.error("uploadAvatar ERROR:", error);
    res.status(500).json({ message: "Server error while uploading avatar" });
  }
};

//  DELETE ACCOUNT (SOFT DELETE)
exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "talent") {
      // Instead of deleting, mark all their applications as applicantDeleted
      await Application.updateMany(
        { applicant: userId },
        { applicantDeleted: true } 
      );
    }

    if (role === "director") {
      // Soft delete all castings created by director
      await Casting.updateMany(
        { postedBy: userId },
        { isActive: false, deletedAt: new Date() }
      );
    }

    // Soft delete user
    await User.findByIdAndUpdate(userId, { isActive: false });

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("deleteMyAccount ERROR:", error);
    res.status(500).json({ message: "Server error while deleting account" });
  }
};




//  GET DIRECTOR PROFILE 
exports.getDirectorProfile = async (req, res) => {
  try {
    const director = await User.findOne({
      _id: req.params.id,
      role: "director",
      isActive: true,
    }).select("name email avatar bio role createdAt");

    if (!director) return res.status(404).json({ message: "User not found" });

    res.status(200).json(director);
  } catch (error) {
    console.error("getDirectorProfile ERROR:", error);
    res.status(500).json({ message: "Server error while fetching director profile" });
  }
};

