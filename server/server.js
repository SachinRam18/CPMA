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
app.use(express.urlencoded({ extended: true }));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "********";
    console.log("Body:", JSON.stringify(safeBody));
  }
  next();
});

// Routes - Mapped twice to support both /api/path and /path fallback (fixing frontend mismatches)
const routes = [
  { path: "/auth", router: authRoutes },
  { path: "/jobs", router: jobsRoutes },
  { path: "/applications", router: applicationsRoutes },
  { path: "/profile", router: profileRoutes },
  { path: "/admin", router: adminRoutes },
  { path: "/companies", router: companiesRoutes },
  { path: "/drives", router: drivesRoutes },
];

routes.forEach((route) => {
  app.use(`/api${route.path}`, route.router);
  app.use(route.path, route.router);
});

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "CPMS API is running", status: "online" });
});

app.get("/api/status", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Alias for common health checks
app.get("/health", (_req, res) => res.json({ status: "online" }));
app.get("/api/health", (_req, res) => res.json({ status: "online" }));

// Global Error Handler for parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON Parsing Error:", err.message);
    return res.status(400).json({ message: "Malformed JSON request body" });
  }
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
