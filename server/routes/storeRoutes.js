const express = require("express");
const { createStore, getAllStores, getStoreById } = require("../controllers/storeController");

const router = express.Router();

router.post("/add", createStore); // Add a new store
router.get("/", getAllStores); // Get all stores
router.get("/:id", getStoreById); // Get a store by ID

module.exports = router;
