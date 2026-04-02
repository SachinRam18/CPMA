const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["applied", "screening", "shortlisted", "test", "technical", "hr", "selected", "offered", "rejected", "withdrawn"],
      default: "applied",
    },
    currentRound: { type: Number, default: 0 },
    totalRounds: { type: Number, default: 1 },
    optedOut: { type: Boolean, default: false },
    optedOutReason: { type: String, default: "" },
    recruiterRemarks: { type: String, default: "" },
    adminVerified: { type: Boolean, default: false },
    interviewSchedule: {
      date: { type: Date },
      time: { type: String, default: "" },
      venue: { type: String, default: "" },
      link: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
