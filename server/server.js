require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");
const applicationsRoutes = require("./routes/applications");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const companiesRoutes = require("./routes/companies");
const drivesRoutes = require("./routes/drives");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/drives", drivesRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "CPMS API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
