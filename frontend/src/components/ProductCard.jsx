import { Link } from 'react-router-dom';
import { FaTag, FaWallet, FaShoppingCart, FaInfoCircle, FaRegHeart, FaHeart, FaFire } from 'react-icons/fa';
import { useState } from 'react';

const ProductCard = ({ product, addToCart }) => {
  const { _id, name, description, price, category, image, cashbackPercentage } = product;
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Default image if none provided
  const productImage = image || 'https://via.placeholder.com/300';
  
  // Calculate discount based on category
  const getDiscount = () => {
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
      discountPercentage,
      discountAmount,
      discountedPrice
    };
  };
  
  const { discountPercentage, discountAmount, discountedPrice } = getDiscount();

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    try {
      addToCart(product);
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'A': return 'bg-purple-600';
      case 'B': return 'bg-blue-600';
      case 'C': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 ${
        isHovered ? 'transform -translate-y-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 z-10 bg-white bg-opacity-90 w-9 h-9 rounded-full flex items-center justify-center shadow-sm hover:shadow transition-all duration-200"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-500 text-lg" />
          )}
        </button>
        
        {/* Product image */}
        <div className="h-56 overflow-hidden">
          <img 
            src={productImage} 
            alt={name} 
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'transform scale-110' : ''
            }`}
          />
        </div>
        
        {/* Category badge */}
        <div className={`absolute top-3 left-3 ${getCategoryColor(category)} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center space-x-1`}>
          <span>Category {category}</span>
        </div>
        
        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center space-x-1 animate-pulse">
            <FaTag className="mr-1" /> 
            <span>{discountPercentage}% OFF</span>
          </div>
        )}
      </div>
      
      {/* Product details */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{name}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <div>
              {discountPercentage > 0 ? (
                <div>
                  <span className="text-gray-400 line-through text-sm mr-2">₹{price.toFixed(2)}</span>
                  <span className="text-gray-900 font-bold text-xl">₹{discountedPrice.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-gray-900 font-bold text-xl">₹{price.toFixed(2)}</span>
              )}
            </div>
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <FaWallet className="mr-1" />
              {cashbackPercentage}% Cashback
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/products/${_id}`} 
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-center text-sm font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <FaInfoCircle className="mr-1" /> Details
          </Link>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`flex-[2] rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center transition-all duration-200 ${
              isAddingToCart 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FaShoppingCart className="mr-1" />
            {isAddingToCart ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 