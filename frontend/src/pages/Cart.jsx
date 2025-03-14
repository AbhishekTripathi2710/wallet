import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { FaTrash, FaMinus, FaPlus, FaWallet, FaCreditCard, FaTag } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, totalAmount, discountedAmount, updateQuantity, removeFromCart, clearCart, getItemDiscountInfo } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [useWallet, setUseWallet] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Calculate total savings
  const totalSavings = totalAmount - discountedAmount;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const orderData = {
        products: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        paymentMethod,
        useWallet
      };

      const response = await orderService.createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation page
      navigate(`/orders/${response.data.order._id}`, { 
        state: { 
          orderDetails: response.data 
        } 
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to process your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link 
              to="/products" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
              </div>
              
              <div className="divide-y">
                {cartItems.map(item => {
                  const { discountPercentage, discountedPrice } = getItemDiscountInfo(item);
                  
                  return (
                    <div key={item._id} className="p-4 flex flex-col sm:flex-row items-center">
                      <div className="sm:w-20 sm:h-20 mb-4 sm:mb-0">
                        <img 
                          src={item.image || 'https://via.placeholder.com/80'} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-1 sm:ml-6">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Category {item.category} - {item.cashbackPercentage}% Cashback</p>
                        <div className="flex items-center">
                          {discountPercentage > 0 && (
                            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">
                              <FaTag className="mr-1" /> {discountPercentage}% OFF
                            </span>
                          )}
                          <p className="font-medium">
                            {discountPercentage > 0 && (
                              <span className="text-gray-500 line-through mr-2">₹{item.price.toFixed(2)}</span>
                            )}
                            <span className="text-green-600">₹{discountedPrice.toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 sm:mt-0">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <FaMinus className="text-gray-600" />
                        </button>
                        
                        <span className="mx-3 w-8 text-center">{item.quantity}</span>
                        
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <FaPlus className="text-gray-600" />
                        </button>
                        
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="ml-4 p-2 text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      <FaTag className="mr-1" /> Discount
                    </span>
                    <span>-₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Discounted Total</span>
                  <span>₹{discountedAmount.toFixed(2)}</span>
                </div>
                
                {isAuthenticated && user?.wallet?.balance > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="use-wallet"
                        checked={useWallet}
                        onChange={() => setUseWallet(!useWallet)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="use-wallet" className="text-gray-600 flex items-center">
                        <FaWallet className="mr-1" /> Use Wallet Balance
                      </label>
                    </div>
                    <span className="text-green-600">₹{user.wallet.balance.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{discountedAmount.toFixed(2)}</span>
                </div>
                {isAuthenticated && useWallet && (
                  <p className="text-sm text-gray-600 mt-1">
                    (Up to 90% of your wallet balance may be used)
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="CREDIT_CARD"
                      checked={paymentMethod === 'CREDIT_CARD'}
                      onChange={() => setPaymentMethod('CREDIT_CARD')}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FaCreditCard className="mr-2 text-blue-600" />
                    Credit Card
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="DEBIT_CARD"
                      checked={paymentMethod === 'DEBIT_CARD'}
                      onChange={() => setPaymentMethod('DEBIT_CARD')}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FaCreditCard className="mr-2 text-green-600" />
                    Debit Card
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="mr-2">💵</span>
                    Cash on Delivery
                  </label>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-4 bg-transparent hover:bg-gray-100 text-gray-800 py-3 rounded-md font-semibold border border-gray-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 