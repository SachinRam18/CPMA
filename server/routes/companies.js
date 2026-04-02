const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const { authorize } = require("../middleware/auth");

router.get("/", authorize(["admin", "student", "recruiter"]), async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my", authorize(["recruiter"]), async (req, res) => {
  try {
    const company = await Company.findOne({ recruiter: req.user.id });
    res.json(company || null);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authorize(["recruiter"]), async (req, res) => {
  try {
    const company = new Company({ ...req.body, recruiter: req.user.id });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authorize(["recruiter"]), async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id },
      req.body,
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
