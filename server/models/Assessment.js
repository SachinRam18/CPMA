const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["aptitude", "coding", "mock-interview", "communication"], required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, default: 100 },
    percentile: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
