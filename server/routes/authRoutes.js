const express = require("express");
const { signup, login } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", signup); // Register a new user
router.post("/login", login); // User login
router.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

module.exports = router;
