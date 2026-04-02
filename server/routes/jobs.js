const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const { authorize } = require("../middleware/auth");

router.get("/", authorize(["student", "recruiter", "admin"]), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "recruiter") {
      query.postedBy = req.user.id;
    } else if (req.user.role === "student") {
      // In a real app, query by student eligibility (CGPA, dept)
      query.status = "open";
    }
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authorize(["recruiter"]), async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user.id
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/apply/:jobId", authorize(["student"]), async (req, res) => {
  try {
    const existing = await Application.findOne({ student: req.user.id, job: req.params.jobId });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const app = new Application({
      student: req.user.id,
      job: req.params.jobId,
      status: "applied",
      totalRounds: job.hiringProcess?.length || 1,
      currentRound: 1
    });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
