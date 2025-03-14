const Product = require('../models/Product');
const { cashbackPercentages } = require('../config/cashback');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    // Add cashback percentage information to each product
    const productsWithCashback = products.map(product => {
      const productObj = product.toObject();
      productObj.cashbackPercentage = cashbackPercentages[product.category] || 0;
      return productObj;
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products: productsWithCashback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const productObj = product.toObject();
    productObj.cashbackPercentage = cashbackPercentages[product.category] || 0;
    
    res.status(200).json({
      success: true,
      product: productObj
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    
    // Validate category
    if (!['A', 'B', 'C'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be A, B, or C' });
    }
    
    const product = new Product({
      name,
      description,
      price,
      category,
      image
    });
    
    await product.save();
    
    const productObj = product.toObject();
    productObj.cashbackPercentage = cashbackPercentages[product.category] || 0;
    
    res.status(201).json({
      success: true,
      product: productObj
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validate category
    if (!['A', 'B', 'C'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be A, B, or C' });
    }
    
    const products = await Product.find({ category });
    
    // Add cashback percentage information to each product
    const productsWithCashback = products.map(product => {
      const productObj = product.toObject();
      productObj.cashbackPercentage = cashbackPercentages[product.category] || 0;
      return productObj;
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      cashbackPercentage: cashbackPercentages[category] || 0,
      products: productsWithCashback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 