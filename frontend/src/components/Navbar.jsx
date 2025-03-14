import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaWallet, FaShoppingCart, FaUser, FaSignOutAlt, FaShoppingBag, FaHome, FaClipboardList, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add shadow to navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav style={{ 
      backgroundColor: '#2c3e50', 
      color: 'white',
      boxShadow: scrolled ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'box-shadow 0.3s'
    }}>
      <div className="container mx-auto" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaWallet style={{ fontSize: '1.5rem' }} /> 
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>E-Commerce Wallet</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="mobile-menu-button"
            style={{ 
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div 
            ref={menuRef}
            className={`navbar-nav ${mobileMenuOpen ? 'show' : ''}`} 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '1.5rem'
            }}
          >
            <li className="nav-item">
              <Link 
                to="/" 
                className="nav-link" 
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/products" 
                className="nav-link" 
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingBag /> Products
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link 
                    to="/orders" 
                    className="nav-link" 
                    style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaClipboardList /> My Orders
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link 
                    to="/wallet" 
                    className="nav-link" 
                    style={{ 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.25rem'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaWallet /> 
                    <span>₹{user?.wallet?.balance.toFixed(2) || '0.00'}</span>
                  </Link>
                </li>
                
                <li className="nav-item">
                  <div className="dropdown">
                    <button 
                      className="nav-link" 
                      style={{ 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        padding: '0.5rem 0'
                      }}
                    >
                      <FaUser /> {user?.name || 'Account'}
                    </button>
                    <div className="dropdown-menu" style={{ backgroundColor: '#34495e', border: '1px solid #2c3e50' }}>
                      <Link 
                        to="/profile" 
                        className="dropdown-item" 
                        style={{ color: 'white' }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }} 
                        className="dropdown-item" 
                        style={{ color: 'white' }}
                      >
                        <FaSignOutAlt style={{ marginRight: '0.25rem' }} /> Logout
                      </button>
                    </div>
                  </div>
                </li>
                
                <li className="nav-item">
                  <Link 
                    to="/cart" 
                    className="nav-link" 
                    style={{ 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#e74c3c',
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      fontSize: '1.125rem',
                      position: 'relative'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaShoppingCart />
                    {totalItems > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#f1c40f',
                        color: '#2c3e50',
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    to="/login" 
                    className="nav-link" 
                    style={{ color: 'white' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/register" 
                    className="btn" 
                    style={{ 
                      backgroundColor: '#e74c3c', 
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      fontWeight: '500',
                      textDecoration: 'none'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 