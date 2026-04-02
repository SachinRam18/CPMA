const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    companyName: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    jobType: { type: String, enum: ["full-time", "internship", "contract"], default: "full-time" },
    ctcMin: { type: Number, default: 0 },
    ctcMax: { type: Number, default: 0 },
    rolesCount: { type: Number, default: 1 },
    eligibilityCriteria: {
      minCGPA: { type: Number, default: 0 },
      maxBacklogs: { type: Number, default: 0 },
      requiredSkills: [{ type: String, trim: true }],
      departments: [{ type: String, trim: true }],
      batch: { type: Number },
    },
    hiringProcess: [
      {
        round: { type: Number },
        type: { type: String, enum: ["aptitude", "coding", "technical", "hr", "group-discussion"] },
        name: { type: String },
      },
    ],
    deadline: { type: Date },
    status: { type: String, enum: ["draft", "open", "closed", "filled"], default: "open" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
