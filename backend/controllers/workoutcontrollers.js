const Workout = require('../models/workout');

const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWorkout = async (req, res) => {
  try {
    const { title, type, duration, calories, difficulty } = req.body;
    
    if (!title || !type || !duration) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const workout = await Workout.create({
      title,
      type,
      duration,
      calories,
      difficulty,
      userId: req.user.id
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getWorkouts,
  createWorkout
};
