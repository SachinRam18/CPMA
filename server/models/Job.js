const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    salary: { type: String, default: "" },
    eligibilityCriteria: {
      minCGPA: { type: Number, default: 0 },
      maxBacklogs: { type: Number, default: 0 },
      requiredSkills: [{ type: String, trim: true }],
      departments: [{ type: String, trim: true }],
    },
    deadline: { type: Date },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
