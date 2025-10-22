const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../controllers/reviewController');

// Get all reviews
router.get('/', getReviews);

// Add a new review
router.post('/', addReview);

module.exports = router;