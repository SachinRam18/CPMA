const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: String, default: "" },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    department: { type: String, default: "" },
    cgpa: { type: Number, default: 0, min: 0, max: 10 },
    backlogs: { type: Number, default: 0 },
    tenthPercentage: { type: Number, default: 0 },
    twelfthPercentage: { type: Number, default: 0 },
    collegeName: { type: String, default: "PSG Institute of Technology and Applied Research" },
    graduationYear: { type: Number },
    skills: [{ type: String, trim: true }],
    resume: { type: String, default: "" },
    projects: [
      {
        title: { type: String },
        description: { type: String },
        techStack: [{ type: String }],
        link: { type: String, default: "" },
      },
    ],
    certifications: [
      {
        name: { type: String },
        issuer: { type: String },
        date: { type: Date },
        link: { type: String, default: "" },
      },
    ],
    preferredRoles: [{ type: String }],
    preferredLocations: [{ type: String }],
    salaryExpectation: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    placementStatus: {
      type: String,
      enum: ["not-placed", "placed", "opted-out"],
      default: "not-placed",
    },
    bookmarkedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    documents: [
      {
        name: { type: String },
        type: { type: String },
        url: { type: String },
        verified: { type: Boolean, default: false },
      },
    ],
    performanceScores: {
      aptitude: { type: Number, default: 0 },
      coding: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
    },
    profileVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
