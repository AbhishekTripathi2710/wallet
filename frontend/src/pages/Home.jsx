import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { FaWallet, FaShoppingCart, FaTag, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        // Get a random selection of products to feature
        const randomProducts = response.data.products
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);
        setFeaturedProducts(randomProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#3498db', 
        color: 'white', 
        padding: '3rem 1rem',
        backgroundImage: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
      }}>
        <div className="container mx-auto">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
              fontWeight: 'bold',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              Shop Smart, Save More with <span style={{ color: '#f1c40f' }}>Wallet Rewards</span>
            </h1>
            <p style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              marginBottom: '2rem',
              maxWidth: '600px'
            }}>
              Earn cashback on every purchase and use your wallet balance for future shopping. The smarter way to shop online!
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link 
                to="/products" 
                style={{ 
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.25rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, background-color 0.2s',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c0392b';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e74c3c';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaShoppingCart /> Shop Now
              </Link>
              <Link 
                to="/register" 
                style={{ 
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.25rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  border: '2px solid white',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cashback Categories Section */}
      <div style={{ padding: '3rem 1rem' }}>
        <div className="container mx-auto">
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            fontWeight: 'bold',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#2c3e50'
          }}>
            Shop by Cashback Categories
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <CategoryCard 
              category="A" 
              title="Category A" 
              cashback="10%" 
              color="#3498db" 
              icon="🎮"
              description="Electronics, gadgets, and tech accessories"
            />
            <CategoryCard 
              category="B" 
              title="Category B" 
              cashback="5%" 
              color="#2ecc71" 
              icon="👕"
              description="Fashion, clothing, and accessories"
            />
            <CategoryCard 
              category="C" 
              title="Category C" 
              cashback="2%" 
              color="#9b59b6" 
              icon="🏠"
              description="Home, kitchen, and lifestyle products"
            />
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div style={{ padding: '3rem 1rem', backgroundColor: 'white' }}>
        <div className="container mx-auto">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Featured Products
            </h2>
            <Link 
              to="/products" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#3498db',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              View All Products <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                border: '3px solid #f3f3f3', 
                borderTop: '3px solid #3498db', 
                borderRadius: '50%', 
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '1rem', color: '#666' }}>Loading products...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#e74c3c' }}>
              {error}
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  addToCart={addToCart} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ padding: '3rem 1rem', backgroundColor: '#f8f9fa' }}>
        <div className="container mx-auto">
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            fontWeight: 'bold',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#2c3e50'
          }}>
            How It Works
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <StepCard 
              number="1" 
              title="Shop Products" 
              description="Browse our wide range of products across different categories."
              icon="🛍️"
            />
            <StepCard 
              number="2" 
              title="Earn Cashback" 
              description="Get cashback rewards based on product categories."
              icon="💰"
            />
            <StepCard 
              number="3" 
              title="Use Your Wallet" 
              description="Apply your wallet balance to future purchases and save more."
              icon="👛"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, title, cashback, color, icon, description }) => {
  return (
    <Link 
      to={`/products/category/${category}`} 
      style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ 
        backgroundColor: color, 
        color: 'white',
        padding: '2rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ 
          display: 'inline-block',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>
          {cashback} Cashback
        </div>
      </div>
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '1rem' }}>{description}</p>
        <div style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: color,
          fontWeight: '600',
          fontSize: '0.875rem'
        }}>
          Shop Now <FaArrowRight />
        </div>
      </div>
    </Link>
  );
};

// Step Card Component
const StepCard = ({ number, title, description, icon }) => {
  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{ 
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#f8f9fa',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#3498db'
      }}>
        {number}
      </div>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#2c3e50' }}>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
    </div>
  );
};

export default Home; 