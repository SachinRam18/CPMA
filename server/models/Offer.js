const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    ctc: { type: Number, required: true },
    role: { type: String, default: "" },
    location: { type: String, default: "" },
    joiningDate: { type: Date },
    status: { type: String, enum: ["released", "accepted", "declined", "expired"], default: "released" },
    offerLetterUrl: { type: String, default: "" },
    releasedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
