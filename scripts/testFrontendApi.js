const axios = require('axios');
require('dotenv').config();

console.log('Testing frontend API connection to backend...');

// Use the same API URL that the frontend would use
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';
console.log('API URL:', API_URL);

// Create axios instance similar to the frontend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

async function testProductsApi() {
  try {
    console.log('Fetching products from:', `${API_URL}/products`);
    const response = await api.get('/products');
    
    console.log('Response status:', response.status);
    console.log('Products count:', response.data.count);
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('First product:');
      console.log(JSON.stringify(response.data.products[0], null, 2));
    } else {
      console.log('No products returned');
    }
  } catch (error) {
    console.error('Error fetching products:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testProductsApi(); 