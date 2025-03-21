import axios from 'axios';

// When deployed as a single project, we can use a relative URL
// When deployed separately, we use the environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API URL:', API_URL); // For debugging

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.message, error.response?.data);
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token if it's invalid or expired
      localStorage.removeItem('token');
      // Redirect to login page if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getCurrentUser: () => api.get('/users/me'),
};

// Wallet services
export const walletService = {
  getWallet: () => api.get('/wallet'),
};

// Product services
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
};

// Order services
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export default api; 