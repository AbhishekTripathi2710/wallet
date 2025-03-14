const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');

// Apply CORS middleware to all routes in this router
router.use(corsMiddleware);

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.register);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', userController.login);

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, userController.getCurrentUser);

module.exports = router; 