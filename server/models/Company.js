const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, default: "" },
    size: { type: String, enum: ["startup", "small", "medium", "large", "enterprise"], default: "medium" },
    website: { type: String, default: "" },
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    contactPerson: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
