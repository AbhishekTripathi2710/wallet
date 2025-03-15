const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model that can access both collections
// This will first try to use the 'products' collection (lowercase)
const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = Product; 