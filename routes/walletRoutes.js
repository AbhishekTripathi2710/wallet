const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');

router.use(corsMiddleware);

router.get('/', auth, walletController.getWallet);

module.exports = router; 