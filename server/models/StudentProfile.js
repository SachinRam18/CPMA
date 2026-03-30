const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    cgpa: { type: Number, default: 0, min: 0, max: 10 },
    skills: [{ type: String, trim: true }],
    department: { type: String, default: "" },
    backlogs: { type: Number, default: 0 },
    resume: { type: String, default: "" },
    graduationYear: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
