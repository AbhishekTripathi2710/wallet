import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
    }
  }, []);

  // Calculate discount based on product category
  const calculateDiscount = (product) => {
    const { category, price } = product;
    let discountPercentage = 0;
    
    switch(category) {
      case 'A':
        discountPercentage = 10; // 10% discount for category A
        break;
      case 'B':
        discountPercentage = 5; // 5% discount for category B
        break;
      case 'C':
        discountPercentage = 2; // 2% discount for category C
        break;
      default:
        discountPercentage = 0;
    }
    
    const discountAmount = (price * discountPercentage) / 100;
    const discountedPrice = price - discountAmount;
    
    return {
      originalPrice: price,
      discountPercentage,
      discountAmount,
      discountedPrice
    };
  };

  // Update localStorage and totals whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calculate totals
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Calculate original total amount
    const originalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate discounted total amount
    const discountedTotal = cartItems.reduce((total, item) => {
      const { discountedPrice } = calculateDiscount(item);
      return total + (discountedPrice * item.quantity);
    }, 0);
    
    setTotalItems(itemCount);
    setTotalAmount(originalAmount);
    setDiscountedAmount(discountedTotal);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item._id === product._id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get discounted price for a specific item
  const getItemDiscountInfo = (item) => {
    return calculateDiscount(item);
  };

  const value = {
    cartItems,
    totalItems,
    totalAmount,
    discountedAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemDiscountInfo
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 