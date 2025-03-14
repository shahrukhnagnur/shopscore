const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No valid token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Unauthorized: No user ID found in token." });
    }

    req.user = { id: decoded.id, role: decoded.role }; // ✅ Ensure req.user contains id & role
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

// ✅ Ensure only Admin can access certain routes
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

// ✅ Ensure only Store Owners can access their routes
exports.isStoreOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "store_owner") {
    return res.status(403).json({ error: "Access denied. Store Owners only." });
  }
  next();
};
