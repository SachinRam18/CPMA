const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const { authorize } = require("../middleware/auth");

router.get("/", authorize(["student", "recruiter", "admin"]), async (req, res) => {
  try {
    if (req.user.role === "student") {
      const apps = await Application.find({ student: req.user.id }).populate("job").sort({ createdAt: -1 });
      res.json(apps);
    } else if (req.user.role === "recruiter") {
      const recruiterJobs = await Job.find({ postedBy: req.user.id }).select("_id");
      const jobIds = recruiterJobs.map(j => j._id);
      const apps = await Application.find({ job: { $in: jobIds } })
        .populate("student", "name email")
        .populate("job", "title")
        .sort({ createdAt: -1 });
      res.json(apps);
    } else {
      const apps = await Application.find().populate("student", "name").populate("job", "title");
      res.json(apps);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authorize(["recruiter", "admin"]), async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!app) return res.status(404).json({ message: "Not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
