const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Restrict to specific roles
const authorize = (...roles) => {
  return async (req, res, next) => {
    // If not already authenticated, authenticate first
    const header = req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    try {
      const token = header.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      // flatten roles in case an array was passed: authorize(["admin"]) -> ["admin"]
      const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;
      
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      next();
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  };
};

module.exports = { auth, authorize };
