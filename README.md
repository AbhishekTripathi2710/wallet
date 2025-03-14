# E-Commerce Wallet Feature

A modern full-stack e-commerce application with wallet and cashback functionality, built using React and Node.js.

## Features

### User Features
- Modern authentication system with animated login/register pages
- Secure wallet system for users
- Dynamic cashback offers based on product categories
- Real-time wallet balance updates
- Detailed transaction history
- Responsive design for all devices

### Shopping Features
- Interactive product cards with hover effects
- Dynamic discount badges based on categories
- Favorite product functionality
- Smooth "Add to Cart" animations
- Real-time cart updates
- Detailed order tracking

### UI/UX Improvements
- Modern, responsive design across all pages
- Animated components and transitions
- Mobile-friendly navigation with hamburger menu
- Dynamic error handling with animated notifications
- Loading states and visual feedback
- Consistent color scheme and typography

## Cashback Percentages

- Category A: 10% (Best Seller products)
- Category B: 2%
- Category C: 7%

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Context API for state management
- Modern CSS with animations
- Responsive design principles
- Icon libraries for enhanced UI

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Create a `.env` file in the root directory with:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/ecommerce-wallet
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
6. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## API Endpoints

### Authentication Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile

### Wallet Routes
- `GET /api/wallet` - Get wallet balance and transactions
- `POST /api/wallet/add` - Add funds to wallet
- `POST /api/wallet/withdraw` - Withdraw funds

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/:category` - Filter by category
- `POST /api/products` - Add new product (admin)

### Order Routes
- `POST /api/orders` - Create new order
- `GET /api/orders` - View user orders
- `GET /api/orders/:id` - Get order details

## Recent Updates

### UI Improvements
- Enhanced Login and Register pages with modern design
- Improved ProductCard component with animations
- Responsive Navbar with mobile optimization
- New loading animations and transitions
- Better error handling and user feedback

### Functionality Updates
- Integrated orderService for API calls
- Enhanced token handling and authentication
- Improved cart management
- Better error handling in API service
- Optimized API response handling

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License. 