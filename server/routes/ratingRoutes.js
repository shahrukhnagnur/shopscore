const express = require("express");
const { submitRating, getStoreRatings } = require("../controllers/ratingController");

const router = express.Router();

router.post("/submit", submitRating); // Submit a rating for a store
router.get("/:storeId", getStoreRatings); // Get all ratings for a store

module.exports = router;
