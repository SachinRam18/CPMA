const mongoose = require("mongoose");

const interviewRoundSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    roundNumber: { type: Number, required: true },
    roundType: { type: String, enum: ["aptitude", "coding", "technical", "hr", "group-discussion"], required: true },
    status: { type: String, enum: ["scheduled", "completed", "passed", "failed", "absent"], default: "scheduled" },
    score: { type: Number, default: null },
    maxScore: { type: Number, default: 100 },
    feedback: { type: String, default: "" },
    conductedBy: { type: String, default: "" },
    date: { type: Date },
    venue: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewRound", interviewRoundSchema);
