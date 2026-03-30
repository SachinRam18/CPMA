const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const StudentProfile = require("../models/StudentProfile");

const router = express.Router();

// GET /api/profile — Get full student profile
router.get("/", auth, authorize("student"), async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id }).populate("user", "name email");
    if (!profile) {
      profile = await StudentProfile.create({ user: req.user._id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile — Update student profile
router.put("/", auth, authorize("student"), async (req, res) => {
  try {
    const { cgpa, skills, resume, department, backlogs, graduationYear } = req.body;
    
    // Process skills if it comes as a comma-separated string from frontend tag input
    let parsedSkills = skills;
    if (typeof skills === "string") {
      parsedSkills = skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { cgpa, skills: parsedSkills, resume, department, backlogs, graduationYear },
      { new: true, upsert: true }
    ).populate("user", "name email");

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
