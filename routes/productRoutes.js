const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');

// Apply CORS middleware to all routes in this router
router.use(corsMiddleware);

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', auth, productController.createProduct);

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', productController.getProductsByCategory);

module.exports = router; 