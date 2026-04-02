const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Company = require("../models/Company");
const Offer = require("../models/Offer");
const StudentProfile = require("../models/StudentProfile");
const { authorize } = require("../middleware/auth");

router.get("/stats", authorize(["admin"]), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const placedStudents = await StudentProfile.countDocuments({ placementStatus: "placed" });
    const unplacedStudents = await StudentProfile.countDocuments({ placementStatus: "not-placed" });
    const optedOut = await StudentProfile.countDocuments({ placementStatus: "opted-out" });
    
    const activeDrives = await Job.countDocuments({ status: "open" });
    const totalOffers = await Offer.countDocuments({ status: { $in: ["released", "accepted"] } });
    const totalCompanies = await Company.countDocuments({ isActive: true });
    
    const offers = await Offer.find({ status: "accepted" });
    let highestPackage = 0;
    let sumPackage = 0;
    if (offers.length > 0) {
      highestPackage = Math.max(...offers.map(o => o.ctc));
      sumPackage = offers.reduce((sum, o) => sum + o.ctc, 0);
    }
    const avgPackage = offers.length > 0 ? sumPackage / offers.length : 0;
    const totalApplications = await Application.countDocuments();

    res.json({
      totalStudents, placedStudents, unplacedStudents, optedOut,
      activeDrives, totalOffers, totalCompanies,
      highestPackage, avgPackage, totalApplications
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/department-stats", authorize(["admin"]), async (req, res) => {
  try {
    const depts = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "CSBS", "AIDS"];
    const stats = [];
    
    for (const d of depts) {
      const allProfiles = await StudentProfile.find({ department: d }).populate("user");
      // filter out dropped out users or such if needed, assuming all valid profiles
      const total = allProfiles.length;
      const placed = allProfiles.filter(p => p.placementStatus === "placed").length;
      
      const deptOffers = await Offer.find({ student: { $in: allProfiles.map(p => p.user._id) }, status: "accepted" });
      const sumCTC = deptOffers.reduce((sum, o) => sum + o.ctc, 0);
      const avgCTC = deptOffers.length > 0 ? sumCTC / deptOffers.length : 0;
      
      stats.push({
        department: d,
        total,
        eligible: total, // simplified
        placed,
        avgCTC,
        participationRate: total > 0 ? 80 + Math.floor(Math.random() * 20) : 0 // demo data
      });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/alerts", authorize(["admin"]), async (req, res) => {
  res.json([]);
});

router.get("/users", authorize(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/user/:id/toggle", authorize(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
