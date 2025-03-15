import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { FaTrash, FaMinus, FaPlus, FaWallet, FaCreditCard, FaTag, FaShoppingBag, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';

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
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center border border-gray-100">
            <div className="mb-6 text-gray-300">
              <FaShoppingBag size={80} className="mx-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link 
              to="/products" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center"
            >
              <FaShoppingBag className="mr-2" /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Cart Items ({cartItems.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <FaTrash className="mr-1" /> Clear Cart
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map(item => {
                  const { discountPercentage, discountedPrice } = getItemDiscountInfo(item);
                  
                  return (
                    <div key={item._id} className="p-5 flex flex-col sm:flex-row items-center hover:bg-gray-50 transition-colors duration-150">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={item.image || 'https://via.placeholder.com/80'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 sm:ml-6">
                        <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">Category {item.category} - {item.cashbackPercentage}% Cashback</p>
                        <div className="flex items-center">
                          {discountPercentage > 0 && (
                            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2">
                              <FaTag className="mr-1" /> {discountPercentage}% OFF
                            </span>
                          )}
                          <p className="font-medium">
                            {discountPercentage > 0 && (
                              <span className="text-gray-400 line-through mr-2">₹{item.price.toFixed(2)}</span>
                            )}
                            <span className="text-green-600 font-bold">₹{discountedPrice.toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 sm:mt-0 space-x-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className={`${item.quantity <= 1 ? 'text-gray-400' : 'text-gray-600'}`} />
                          </button>
                          
                          <span className="mx-3 w-8 text-center font-medium">{item.quantity}</span>
                          
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FaPlus className="text-gray-600" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
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
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 pb-2 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      <FaTag className="mr-2" /> Discount
                    </span>
                    <span>-₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold pt-3 border-t border-gray-100 text-gray-800">
                  <span>Total Amount</span>
                  <span>₹{discountedAmount.toFixed(2)}</span>
                </div>
                
                {isAuthenticated && user?.wallet?.balance > 0 && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="use-wallet"
                        checked={useWallet}
                        onChange={() => setUseWallet(!useWallet)}
                        className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="use-wallet" className="text-gray-700 flex items-center">
                        <FaWallet className="mr-2 text-blue-500" /> Use Wallet Balance
                      </label>
                    </div>
                    <span className="text-green-600 font-medium">₹{user.wallet.balance.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg text-gray-800 mb-2">
                  <span>To Pay</span>
                  <span>₹{discountedAmount.toFixed(2)}</span>
                </div>
                {isAuthenticated && useWallet && (
                  <p className="text-sm text-gray-500 italic">
                    (Up to 90% of your wallet balance may be used)
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800">Payment Method</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="CREDIT_CARD"
                      checked={paymentMethod === 'CREDIT_CARD'}
                      onChange={() => setPaymentMethod('CREDIT_CARD')}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FaCreditCard className="mr-3 text-blue-600" />
                    <span className="text-gray-700">Credit Card</span>
                  </label>
                  
                  <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="DEBIT_CARD"
                      checked={paymentMethod === 'DEBIT_CARD'}
                      onChange={() => setPaymentMethod('DEBIT_CARD')}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FaCreditCard className="mr-3 text-green-600" />
                    <span className="text-gray-700">Debit Card</span>
                  </label>
                  
                  <label className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FaMoneyBillWave className="mr-3 text-gray-600" />
                    <span className="text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold text-white text-lg flex items-center justify-center
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200'
                  }`}
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 