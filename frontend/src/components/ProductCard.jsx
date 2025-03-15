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

  return (
    <div 
      className="product-card animate-fade-in"
      style={{ 
        backgroundColor: 'white', 
        borderRadius: '1rem', 
        overflow: 'hidden',
        boxShadow: isHovered 
          ? '0 15px 30px rgba(0, 0, 0, 0.15)' 
          : '0 5px 15px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        border: '1px solid #f0f0f0'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative' }}>
        <div 
          style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s'
          }}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? (
            <FaHeart style={{ color: '#e74c3c', fontSize: '1.2rem' }} />
          ) : (
            <FaRegHeart style={{ color: '#7f8c8d', fontSize: '1.2rem' }} />
          )}
        </div>
        
        <img 
          src={productImage} 
          alt={name} 
          style={{ 
            width: '100%', 
            height: '220px', 
            objectFit: 'cover',
            transition: 'transform 0.5s',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          backgroundColor: getCategoryColor(category), 
          color: 'white', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '2rem',
          fontSize: '0.75rem', 
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span>Category {category}</span>
        </div>
        
        {discountPercentage > 0 && (
          <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '10px', 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '2rem',
            fontSize: '0.8rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
            animation: 'pulse 2s infinite'
          }}>
            <FaTag /> {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        position: 'relative'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          color: '#2c3e50',
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap' 
        }}>{name}</h3>
        
        <p style={{ 
          color: '#7f8c8d', 
          fontSize: '0.9rem', 
          marginBottom: '1rem', 
          display: '-webkit-box', 
          WebkitLineClamp: '2', 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          flexGrow: 1,
          lineHeight: '1.5'
        }}>{description}</p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.25rem',
          padding: '0.75rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '0.5rem'
        }}>
          <div>
            {discountPercentage > 0 ? (
              <div>
                <span style={{ 
                  textDecoration: 'line-through', 
                  color: '#95a5a6', 
                  fontSize: '0.9rem',
                  marginRight: '0.5rem'
                }}>
                  ₹{price.toFixed(2)}
                </span>
                <span style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  display: 'block'
                }}>
                  ₹{discountedPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div style={{ 
                fontSize: '1.4rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                ₹{price.toFixed(2)}
              </div>
            )}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#27ae60', 
            fontSize: '0.9rem', 
            fontWeight: '600',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            padding: '0.4rem 0.75rem',
            borderRadius: '2rem'
          }}>
            <FaWallet style={{ marginRight: '0.4rem' }} />
            {cashbackPercentage}% Cashback
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link 
            to={`/products/${_id}`} 
            style={{ 
              flex: '0 0 40%', 
              textAlign: 'center', 
              padding: '0.75rem 0',
              backgroundColor: '#34495e',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s',
              boxShadow: '0 2px 5px rgba(52, 73, 94, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2c3e50';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#34495e';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FaInfoCircle /> Details
          </Link>
          <button 
            onClick={handleAddToCart} 
            style={{ 
              flex: '1', 
              padding: '0.75rem 0',
              backgroundColor: isAddingToCart ? '#27ae60' : '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s',
              boxShadow: '0 2px 5px rgba(231, 76, 60, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!isAddingToCart) {
                e.currentTarget.style.backgroundColor = '#c0392b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAddingToCart) {
                e.currentTarget.style.backgroundColor = '#e74c3c';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#27ae60',
                  transform: 'translateX(-100%)',
                  animation: 'slideInRight 0.5s forwards'
                }}></div>
                <span style={{ position: 'relative', zIndex: 1 }}>Added!</span>
              </>
            ) : (
              <>
                <FaShoppingCart /> Add to Cart
              </>
            )}
          </button>
        </div>
        
        {category === 'A' && (
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            backgroundColor: '#f39c12',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: '0 2px 5px rgba(243, 156, 18, 0.3)'
          }}>
            <FaFire /> Best Seller
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get color based on category
const getCategoryColor = (category) => {
  switch(category) {
    case 'A':
      return '#3498db'; // Blue
    case 'B':
      return '#2ecc71'; // Green
    case 'C':
      return '#9b59b6'; // Purple
    default:
      return '#95a5a6'; // Gray
  }
};

// Add keyframe animation for the "Added to Cart" effect
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
  }
`;
document.head.appendChild(style);

export default ProductCard; 