const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('[AUTH] Register attempt:', { body: req.body });
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine isAdmin flag server-side. Only allow admin when credentials match
    // configured admin credentials or explicit registration is enabled.
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'fuse76758@gmail.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'freeuse1234';
    let isAdmin = false;

    // If client requested isAdmin, verify server-side conditions before granting it.
    if (req.body.isAdmin) {
      if (
        (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) ||
        process.env.ALLOW_ADMIN_REGISTRATION === 'true'
      ) {
        isAdmin = true;
      } else {
        console.log('[AUTH] Admin registration denied for', email);
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('[AUTH] Login attempt:', { body: req.body });
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      // Update last login
      user.lastLogin = new Date();

      // Compute admin override based on server-configured admin credentials
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'fuse76758@gmail.com';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'freeuse1234';
      const allowAdminRegistration = process.env.ALLOW_ADMIN_REGISTRATION === 'true';

      const adminByCreds = (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) || allowAdminRegistration;

      if (adminByCreds && !user.isAdmin) {
        user.isAdmin = true;
        console.log('[AUTH] Elevated user to admin:', email);
      }

      await user.save();

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = router;