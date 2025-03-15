const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

console.log('Starting seed script...');

// Allow passing a database URL as an environment variable
const DB_URL = process.env.SEED_DB_URL || process.env.DB_CONNECT;
console.log('DB_CONNECT:', DB_URL);

console.log('Attempting to connect to MongoDB...');
mongoose.connect(DB_URL)
  .then(async () => {
    console.log('MongoDB Connected');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Connected to host:', mongoose.connection.host);
    
    try {
      // Check for existing products
      console.log('Checking for existing products...');
      const existingProducts = await Product.find();
      console.log(`Found ${existingProducts.length} existing products`);
      
      // Delete existing products
      await Product.deleteMany({});
      console.log('Existing products cleared');
      
      // Sample products data
      const productsData = [
        {
          name: 'Premium Smartphone',
          description: 'Latest flagship smartphone with high-end features, 6.7-inch AMOLED display, 128GB storage, and 12GB RAM.',
          price: 999.99,
          category: 'A',
          image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2042&auto=format&fit=crop'
        },
        {
          name: 'Wireless Headphones',
          description: 'Noise-cancelling wireless headphones with 30-hour battery life and premium sound quality.',
          price: 249.99,
          category: 'B',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop'
        },
        {
          name: 'Smart Watch',
          description: 'Fitness tracker and smartwatch with heart rate monitoring, GPS, and 7-day battery life.',
          price: 199.99,
          category: 'B',
          image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop'
        },
        {
          name: 'Laptop',
          description: 'Ultra-thin laptop with 16GB RAM, 512GB SSD, and 14-inch 4K display.',
          price: 1299.99,
          category: 'A',
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop'
        },
        {
          name: 'Bluetooth Speaker',
          description: 'Portable waterproof Bluetooth speaker with 24-hour battery life and deep bass.',
          price: 79.99,
          category: 'C',
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2069&auto=format&fit=crop'
        },
        {
          name: 'Tablet',
          description: '10.5-inch tablet with 64GB storage, perfect for entertainment and productivity.',
          price: 349.99,
          category: 'B',
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2033&auto=format&fit=crop'
        },
        {
          name: 'Gaming Console',
          description: 'Next-generation gaming console with 1TB storage and 4K gaming capabilities.',
          price: 499.99,
          category: 'A',
          image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=2072&auto=format&fit=crop'
        },
        {
          name: 'Wireless Earbuds',
          description: 'True wireless earbuds with active noise cancellation and 8-hour battery life.',
          price: 129.99,
          category: 'C',
          image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?q=80&w=2070&auto=format&fit=crop'
        },
        {
          name: 'Smart Home Hub',
          description: 'Control your smart home devices with voice commands and automation.',
          price: 89.99,
          category: 'C',
          image: 'https://images.unsplash.com/photo-1558002038-1055e2e28ed1?q=80&w=2070&auto=format&fit=crop'
        },
        {
          name: 'Digital Camera',
          description: 'Mirrorless camera with 24MP sensor, 4K video recording, and interchangeable lenses.',
          price: 799.99,
          category: 'A',
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop'
        }
      ];
      
      // Insert products
      const products = await Product.insertMany(productsData);
      console.log(`${products.length} products created`);
      console.log(`First product ID: ${products[0]._id}`);
      
    } catch (error) {
      console.error('Error seeding products:', error);
    } finally {
      mongoose.connection.close();
      console.log('Database connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }); 