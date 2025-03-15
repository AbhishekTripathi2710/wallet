const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting collection check script...');
console.log('DB_CONNECT:', process.env.DB_CONNECT);

mongoose.connect(process.env.DB_CONNECT)
  .then(async () => {
    console.log('MongoDB Connected');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    try {
      // List all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections in database:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
      // Check products collection specifically
      if (collections.some(c => c.name === 'products')) {
        const productsCount = await mongoose.connection.db.collection('products').countDocuments();
        console.log(`Products collection contains ${productsCount} documents`);
        
        // Show a sample product
        if (productsCount > 0) {
          const sampleProduct = await mongoose.connection.db.collection('products').findOne();
          console.log('Sample product:');
          console.log(JSON.stringify(sampleProduct, null, 2));
        }
      } else {
        console.log('Products collection does not exist');
      }
    } catch (error) {
      console.error('Error checking collections:', error);
    } finally {
      mongoose.connection.close();
      console.log('Database connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }); 