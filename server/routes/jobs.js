const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const Job = require("../models/Job");
const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");

const router = express.Router();

// GET /api/jobs — list jobs (with basic filters)
router.get("/", auth, async (req, res) => {
  try {
    let query = {};
    
    // If user is a student, only show jobs they are eligible for based on CGPA and backlogs (optional extra logic)
    if (req.user.role === "student") {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      const cgpa = profile ? profile.cgpa : 0;
      const backlogs = profile ? profile.backlogs : 0;

      query = {
        "eligibilityCriteria.minCGPA": { $lte: cgpa },
      };
      // For more strict checking: "eligibilityCriteria.maxBacklogs": { $gte: backlogs }
    } else if (req.user.role === "recruiter") {
      // Recruiter sees only their own jobs by default, or all if parameterized
      query.postedBy = req.user._id;
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs — recruiter creates a new job
router.post("/", auth, authorize("recruiter"), async (req, res) => {
  try {
    const { title, company, description, location, salary, eligibilityCriteria, deadline } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      location,
      salary,
      eligibilityCriteria: eligibilityCriteria || { minCGPA: 0, maxBacklogs: 0, requiredSkills: [], departments: [] },
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs/apply/:jobId — student applies to a job
router.post("/apply/:jobId", auth, authorize("student"), async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check eligibility strictly
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: "Please complete your profile first" });

    if (profile.cgpa < job.eligibilityCriteria.minCGPA) {
      return res.status(400).json({ message: "You do not meet the minimum CGPA requirement" });
    }
    if (job.eligibilityCriteria.maxBacklogs !== undefined && profile.backlogs > job.eligibilityCriteria.maxBacklogs) {
      return res.status(400).json({ message: "You exceed the maximum active backlogs limit" });
    }
    if (job.eligibilityCriteria.departments && job.eligibilityCriteria.departments.length > 0) {
      if (!job.eligibilityCriteria.departments.includes(profile.department)) {
         return res.status(400).json({ message: "Your department is not eligible for this job" });
      }
    }

    // Check duplicate
    const existing = await Application.findOne({ student: req.user._id, job: jobId });
    if (existing) return res.status(400).json({ message: "You have already applied to this job" });

    const application = await Application.create({ student: req.user._id, job: jobId });

    // Notify recruiter
    await Notification.create({
      user: job.postedBy,
      message: `${req.user.name} applied to "${job.title}"`,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate application detected" });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
