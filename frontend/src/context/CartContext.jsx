import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
    }
  }, []);

  const calculateDiscount = (product) => {
    const { category, price } = product;
    let discountPercentage = 0;
    
    switch(category) {
      case 'A':
        discountPercentage = 10;
        break;
      case 'B':
        discountPercentage = 5;
        break;
      case 'C':
        discountPercentage = 2;
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

  const getItemDiscountInfo = (item) => {
    return calculateDiscount(item);
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
    
    const amount = cartItems.reduce((sum, item) => {
      const { discountedPrice } = calculateDiscount(item);
      return sum + (discountedPrice * item.quantity);
    }, 0);
    setDiscountedAmount(amount);
    
    const originalAmount = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    setTotalAmount(originalAmount);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalAmount,
        discountedAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateDiscount,
        getItemDiscountInfo
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 