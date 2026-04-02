const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    status: { type: String, enum: ["upcoming", "active", "completed", "cancelled"], default: "upcoming" },
    eligibility: {
      minCGPA: { type: Number, default: 0 },
      maxBacklogs: { type: Number, default: 0 },
      departments: [{ type: String }],
      batch: { type: Number },
      skills: [{ type: String }],
    },
    schedule: {
      registrationStart: { type: Date },
      registrationEnd: { type: Date },
      driveDate: { type: Date },
    },
    rounds: [
      {
        name: { type: String },
        type: { type: String, enum: ["aptitude", "coding", "technical", "hr", "group-discussion"] },
        date: { type: Date },
        venue: { type: String, default: "" },
        status: { type: String, enum: ["upcoming", "in-progress", "completed"], default: "upcoming" },
      },
    ],
    totalPositions: { type: Number, default: 1 },
    ctcOffered: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlacementDrive", placementDriveSchema);
