const express = require('express');
const { getWorkouts, createWorkout } = require('../controllers/workoutcontrollers');
const Workout = require('../models/workout');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getWorkouts);
router.post('/', protect, createWorkout);

// Featured workouts (public, simple top recent)
router.get('/featured', async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      order: [['createdAt', 'DESC']],
      limit: 6
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured workouts' });
  }
});

module.exports = router;
