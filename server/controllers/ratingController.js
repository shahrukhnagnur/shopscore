const Rating = require("../models/Rating");
const Store = require("../models/Store");

exports.submitRating = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: No user ID found." });
    }

    const { storeId, rating } = req.body;
    if (!storeId || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid store ID or rating value" });
    }

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    let existingRating = await Rating.findOne({ user: req.user.id, store: storeId });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      const newRating = new Rating({ user: req.user.id, store: storeId, rating });
      await newRating.save();
      store.ratings.push(newRating._id);
      await store.save();
    }

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getStoreRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ store: req.params.storeId }).populate("user", "name email");
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
