

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    casting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Casting",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    portfolioLink: {
      type: String,
    },
    portfolioFile: {
      type: String, 
    },
    note: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
    },
    applicantDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
