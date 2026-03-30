const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

const router = express.Router();

// GET /api/applications — role-based application view
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "student") {
      const applications = await Application.find({ student: req.user._id })
        .populate({ path: "job", populate: { path: "postedBy", select: "name company" } })
        .sort({ createdAt: -1 });
      return res.json(applications);
    } 
    
    if (req.user.role === "recruiter") {
      // Get all jobs for this recruiter first
      const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
      const jobIds = jobs.map(j => j._id);

      const applications = await Application.find({ job: { $in: jobIds } })
        .populate("student", "name email")
        .populate("job", "title")
        .sort({ createdAt: -1 });
      return res.json(applications);
    }

    return res.status(403).json({ message: "Not authorized for this view" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/job/:jobId — specific job's applicants (Recruiter)
router.get("/job/:jobId", auth, authorize("recruiter"), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    const applications = await Application.find({ job: req.params.jobId })
      .populate("student", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/applications/:id — update application status (Recruiter)
router.put("/:id", auth, authorize("recruiter"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["shortlisted", "rejected", "selected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      user: application.student,
      message: `Your application status for "${application.job.title}" is now: ${status.toUpperCase()}`,
    });

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
