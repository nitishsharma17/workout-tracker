const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const User = require('../models/user');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.count();
    
    // Get active users (users who have logged in within the last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.count({
      where: { lastLogin: { $gte: thirtyDaysAgo } }
    });

    // Get total workouts count
    const totalWorkouts = await Workout.count();

    // Calculate revenue (mock data - implement actual logic based on your payment system)
    const revenueThisMonth = 12500; // Replace with actual revenue calculation

    // Get user growth data
    // Build simple monthly user growth using raw SQL for portability
    const [userGrowth] = await User.sequelize.query(`
      SELECT DATE_TRUNC('month', "created_at") AS month, COUNT(*) AS count
      FROM "Users"
      GROUP BY month
      ORDER BY month ASC;
    `);

    // Get workout distribution
    const [workoutDistribution] = await Workout.sequelize.query(`
      SELECT type, COUNT(*) AS count
      FROM "Workouts"
      GROUP BY type;
    `);

    res.json({
      totalUsers,
      activeUsers,
      totalWorkouts,
      revenueThisMonth,
      userGrowth,
      workoutDistribution
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      message: 'Error fetching admin dashboard data',
      error: error.message
    });
  }
});

module.exports = router;