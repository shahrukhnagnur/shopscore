const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  getAllStores,
  deleteUser,
  deleteStore,
  addStore,
} = require("../controllers/adminController");
const { authenticateUser, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticateUser, isAdmin, getDashboardStats);
router.get("/users", authenticateUser, isAdmin,getAllUsers);
router.get("/stores", authenticateUser, isAdmin, getAllStores);
router.delete("/user/:id", authenticateUser, isAdmin, deleteUser);
router.delete("/store/:id", authenticateUser, isAdmin, deleteStore);
router.post("/add-store", authenticateUser, isAdmin, addStore);

module.exports = router;
