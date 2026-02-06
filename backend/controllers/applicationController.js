


const Application = require("../db/models/applicationSchema");
const Casting = require("../db/models/castingSchema");

//  APPLY FOR CASTING 
exports.applyForCasting = async (req, res) => {
  try {
    const { castingId, message, portfolioLink } = req.body;

    if (!castingId) {
      return res.status(400).json({ message: "Casting ID is required" });
    }

    // Check casting exists is active
    const casting = await Casting.findOne({
      _id: castingId,
      isActive: true,
    });

    if (!casting) {
      return res
        .status(404)
        .json({ message: "Casting is no longer available" });
    }

    // prevent duplicate application
    const alreadyApplied = await Application.findOne({
      casting: castingId,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this casting" });
    }

    const application = await Application.create({
      casting: castingId,
      applicant: req.user.id,
      message,
      portfolioLink,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("applyForCasting ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE APPLICATION STATUS (Director)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate(
      "casting"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check casting is still active
    if (!application.casting?.isActive) {
      return res
        .status(400)
        .json({ message: "Cannot update application for deleted casting" });
    }

    // Only casting owner can update
    if (application.casting.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    console.error("updateApplicationStatus ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//  GET MY APPLICATIONS (Talent)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate(
        "casting",
        "title description roleType auditionDate location isActive updatedAt isUpdated updateNote lastUpdatedAt"
      )
      .select(`
        message
        status
        portfolioLink
        portfolioFile
        casting
        createdAt
      `)
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("getMyApplications ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//  UPLOAD PORTFOLIO (Talent)
exports.uploadPortfolio = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!req.file || !applicationId) {
      return res
        .status(400)
        .json({ message: "File and application ID required" });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.portfolioFile = req.file.path;
    await application.save();

    res.status(200).json({
      message: "Portfolio uploaded and linked successfully",
      application,
    });
  } catch (error) {
    console.error("uploadPortfolio ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//  GET INCOMING APPLICATIONS (Director)
exports.getIncomingApplications = async (req, res) => {
  try {
    if (req.user.role !== "director") {
      return res.status(403).json({ message: "Access denied" });
    }

    const castings = await Casting.find({ postedBy: req.user.id }).select(
      "_id isActive"
    );
    const castingIds = castings.filter(c => c.isActive).map(c => c._id);

    const applications = await Application.find({
      casting: { $in: castingIds },
    })
      .populate(
        "casting",
        "title auditionDate location isActive updatedAt isUpdated updateNote lastUpdatedAt"
      )
      .populate("applicant", "name email introVideo skills experience avatar isActive")
      .select(`
        message
        status
        portfolioLink
        portfolioFile
        applicant
        casting
        applicantDeleted
        createdAt
      `)
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("getIncomingApplications ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET APPLICATIONS FOR A CASTING (Director)
exports.getApplicationsForCasting = async (req, res) => {
  try {
    const { castingId } = req.params;

    const casting = await Casting.findById(castingId);
    if (!casting || !casting.isActive) {
      return res
        .status(404)
        .json({ message: "Casting not found or deleted" });
    }

    if (casting.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({ casting: castingId })
      .populate("applicant", "name email introVideo skills experience avatar isActive")
      .populate(
        "casting",
        "title isActive updatedAt isUpdated updateNote lastUpdatedAt"
      )
      .select(`
        message
        status
        portfolioLink
        portfolioFile
        applicant
        casting
        applicantDeleted
        createdAt
      `)
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("getApplicationsForCasting ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//  DELETE APPLICATION (Talent)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await application.deleteOne();

    res.status(200).json({
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    console.error("deleteApplication ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//  EDIT APPLICATION (Talent)
exports.updateMyApplication = async (req, res) => {
  try {
    const { message, portfolioLink } = req.body;

    const application = await Application.findById(req.params.id).populate(
      "casting"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Prevent editing if casting is deleted
    if (!application.casting?.isActive) {
      return res
        .status(400)
        .json({ message: "Cannot edit application for deleted casting" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        message: "Cannot edit application after it has been reviewed",
      });
    }

    application.message = message || application.message;
    application.portfolioLink = portfolioLink || application.portfolioLink;

    await application.save();

    res.status(200).json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error("updateMyApplication ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
