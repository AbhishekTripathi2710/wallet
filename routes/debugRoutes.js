const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Route to check database connection and collections
router.get('/db-info', async (req, res) => {
  try {
    const dbInfo = {
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.db?.databaseName || 'Not connected',
      host: mongoose.connection.host || 'Not connected',
      collections: []
    };
    
    if (dbInfo.connected) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      dbInfo.collections = collections.map(c => c.name);
      
      // Check products collection
      if (collections.some(c => c.name === 'products')) {
        const productsCollection = mongoose.connection.db.collection('products');
        const count = await productsCollection.countDocuments();
        dbInfo.productsCount = count;
        
        if (count > 0) {
          const sample = await productsCollection.findOne();
          dbInfo.sampleProduct = sample;
        }
      }
      
      // Check Products collection (capital P)
      if (collections.some(c => c.name === 'Products')) {
        const productsCollection = mongoose.connection.db.collection('Products');
        const count = await productsCollection.countDocuments();
        dbInfo.ProductsCount = count;
        
        if (count > 0) {
          const sample = await productsCollection.findOne();
          dbInfo.sampleProductCapital = sample;
        }
      }
    }
    
    res.json(dbInfo);
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Route to check environment variables
router.get('/env', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    dbConnect: process.env.DB_CONNECT ? 'Set (value hidden)' : 'Not set',
    mongoUri: process.env.MONGO_URI ? 'Set (value hidden)' : 'Not set'
  });
});

module.exports = router; 