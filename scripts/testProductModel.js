const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

console.log('Testing Product model...');
console.log('DB_CONNECT:', process.env.DB_CONNECT);

mongoose.connect(process.env.DB_CONNECT)
  .then(async () => {
    console.log('MongoDB Connected');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    try {
      // Try to find products using the Product model
      const products = await Product.find();
      console.log(`Found ${products.length} products using Product model`);
      
      if (products.length > 0) {
        console.log('First product:');
        console.log(JSON.stringify(products[0], null, 2));
      } else {
        console.log('No products found using the Product model');
        
        // Check if products exist in the collection directly
        const productsCollection = mongoose.connection.db.collection('products');
        const productsCount = await productsCollection.countDocuments();
        console.log(`products collection contains ${productsCount} documents`);
        
        if (productsCount > 0) {
          const sampleProduct = await productsCollection.findOne();
          console.log('Sample product from direct collection access:');
          console.log(JSON.stringify(sampleProduct, null, 2));
        }
      }
    } catch (error) {
      console.error('Error testing Product model:', error);
    } finally {
      mongoose.connection.close();
      console.log('Database connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }); 