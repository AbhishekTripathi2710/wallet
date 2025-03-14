const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');

// Apply CORS middleware to all routes in this router
router.use(corsMiddleware);

// @route   GET /api/wallet
// @desc    Get wallet balance and transaction history
// @access  Private
router.get('/', auth, walletController.getWallet);

module.exports = router; 