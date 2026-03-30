const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");

const router = express.Router();

// GET /api/admin/users — list all users
router.get("/users", auth, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/user/:id/toggle — activate/deactivate user
router.put("/user/:id/toggle", auth, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot toggle your own account" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User account ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/user/:id — delete a user
router.delete("/user/:id", auth, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    await StudentProfile.deleteMany({ user: user._id });
    await Application.deleteMany({ student: user._id });
    await Job.deleteMany({ postedBy: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats
router.get("/stats", auth, authorize("admin"), async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalRecruiters, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    res.json({ totalUsers, totalStudents, totalRecruiters, totalJobs, totalApplications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
