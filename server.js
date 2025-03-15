const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Connect to database
connectDB();

// Import routes
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const debugRoutes = require('./routes/debugRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/debug', debugRoutes);

// Add a simple route for health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Serve static files in production only if the frontend/dist directory exists
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, 'frontend', 'dist');
  
  // Check if the frontend/dist directory exists
  if (fs.existsSync(distPath)) {
    // Set static folder
    app.use(express.static(distPath));

    // Any route that is not an API route will be redirected to index.html
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.resolve(distPath, 'index.html'));
      }
    });
  } else {
    // If frontend/dist doesn't exist, just handle API routes
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.status(404).json({ 
          message: 'Frontend not found. This is an API server only.',
          note: 'If you\'re looking for the frontend, please visit: ' + process.env.FRONTEND_URL
        });
      }
    });
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 