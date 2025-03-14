const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');

router.use(corsMiddleware);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/me', auth, userController.getCurrentUser);

module.exports = router; 