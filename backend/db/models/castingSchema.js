

const mongoose = require("mongoose");

const castingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    roleType: {
      type: String,
      required: true,
      trim: true,
    },


    // not used for now
    ageRange: {
      min: Number,
      max: Number,
    },

    // not used for now
    gender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    auditionDate: {
      type: Date,
      required: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isUpdated: {
      type: Boolean,
      default: false,
    },

    lastUpdatedAt: {
      type: Date,
      default: null,
    },

    updateNote: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true, // true = available, false = deleted/closed
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Casting", castingSchema);
