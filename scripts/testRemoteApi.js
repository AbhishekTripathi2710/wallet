const axios = require('axios');

console.log('Testing remote API...');

const API_URL = 'https://wallet-backend-8ba2.onrender.com/api';
console.log('API URL:', API_URL);

async function testProductsApi() {
  try {
    console.log('Fetching products from:', `${API_URL}/products`);
    const response = await axios.get(`${API_URL}/products`);
    
    console.log('Response status:', response.status);
    console.log('Products count:', response.data.count);
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('First product:');
      console.log(JSON.stringify(response.data.products[0], null, 2));
    } else {
      console.log('No products returned');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
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