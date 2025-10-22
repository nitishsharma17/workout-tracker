const { Review } = require('../models/review');

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Add a new review
const addReview = async (req, res) => {
  try {
    const { name, role, content, rating, avatar } = req.body;
    const review = await Review.create({
      name,
      role,
      content,
      rating,
      avatar
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
};

module.exports = {
  getReviews,
  addReview
};