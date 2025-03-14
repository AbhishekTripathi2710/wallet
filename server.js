const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const corsMiddleware = require('./middleware/cors');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();

// Apply CORS middleware first
app.use(corsMiddleware);

// Middleware
app.use(bodyParser.json());

// Define Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to E-Commerce Wallet API' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 