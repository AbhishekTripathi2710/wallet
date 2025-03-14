const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');

router.use(corsMiddleware);

router.get('/', productController.getProducts);

router.get('/:id', productController.getProductById);

router.post('/', auth, productController.createProduct);

router.get('/category/:category', productController.getProductsByCategory);

module.exports = router; 