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
      collections.forEach(c => console.log(` - ${c.name}`));
      
      // Check Products collection specifically
      if (collections.some(c => c.name === 'Products')) {
        const productsCollection = mongoose.connection.db.collection('Products');
        const count = await productsCollection.countDocuments();
        console.log(`Products collection contains ${count} documents`);
        
        if (count > 0) {
          const sample = await productsCollection.findOne();
          console.log('Sample product:');
          console.log(JSON.stringify(sample, null, 2));
        }
      }
      
      // Check products collection (lowercase)
      if (collections.some(c => c.name === 'products')) {
        const productsCollection = mongoose.connection.db.collection('products');
        const count = await productsCollection.countDocuments();
        console.log(`products collection (lowercase) contains ${count} documents`);
        
        if (count > 0) {
          const sample = await productsCollection.findOne();
          console.log('Sample product (lowercase collection):');
          console.log(JSON.stringify(sample, null, 2));
        }
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