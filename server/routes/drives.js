const express = require("express");
const router = express.Router();
const PlacementDrive = require("../models/PlacementDrive");
const { authorize } = require("../middleware/auth");

router.get("/", authorize(["admin", "student"]), async (req, res) => {
  try {
    const drives = await PlacementDrive.find().populate("company", "name").sort({ "schedule.driveDate": 1 });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
