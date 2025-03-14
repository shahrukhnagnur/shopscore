const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics." });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNormalUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      return res.status(400).json({ error: "Store with this email already exists." });
    }

    const newStore = new Store({ name, email, address });
    await newStore.save();

    res.status(201).json({ message: "Store added successfully", store: newStore });
  } catch (error) {
    console.error("Error adding store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });

    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

