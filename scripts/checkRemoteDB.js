const mongoose = require('mongoose');
require('dotenv').config();

// Use the production database URL
const DB_URL = "mongodb+srv://ronalabhishek:abhishek@authdb.kosny.mongodb.net/authdb?retryWrites=true&w=majority&appName=Authdb";

console.log('Checking remote database...');
console.log('DB_URL:', DB_URL);

mongoose.connect(DB_URL)
  .then(async () => {
    console.log('MongoDB Connected');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    try {
      // List all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections in database:');
      collections.forEach(c => console.log(` - ${c.name}`));
      
      // Check products collection directly (not using the model)
      const productsCollection = mongoose.connection.db.collection('products');
      const count = await productsCollection.countDocuments();
      console.log(`products collection contains ${count} documents`);
      
      if (count > 0) {
        const sample = await productsCollection.findOne();
        console.log('Sample product:');
        console.log(JSON.stringify(sample, null, 2));
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