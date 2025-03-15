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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const userDropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
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
    <nav className={`bg-gradient-to-r from-blue-800 to-blue-900 text-white sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg' : 'shadow-md'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white">
            <FaWallet className="text-2xl text-blue-300" />
            <span className="font-bold text-xl tracking-tight">E-Commerce Wallet</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden bg-blue-700 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-blue-100 hover:text-white flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaHome className="text-blue-300" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/products" 
              className="text-blue-100 hover:text-white flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaShoppingBag className="text-blue-300" />
              <span>Products</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/orders" 
                  className="text-blue-100 hover:text-white flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaClipboardList className="text-blue-300" />
                  <span>Orders</span>
                </Link>
                
                <Link 
                  to="/wallet" 
                  className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-100 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <FaWallet className="text-blue-300" />
                  <span className="font-medium">₹{user?.wallet?.balance.toFixed(2) || '0.00'}</span>
                </Link>
                
                {/* User dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button 
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-1 text-blue-100 hover:text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaUser className="text-blue-300" />
                    <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }} 
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <FaSignOutAlt className="inline mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
                
                <Link 
                  to="/cart" 
                  className="relative p-2 bg-blue-100 hover:bg-blue-500 rounded-full transition-colors duration-200"
                  aria-label="Cart"
                >
                  <FaShoppingCart className="text-xl" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-blue-100 hover:text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div 
            ref={menuRef}
            className={`fixed inset-0 bg-blue-900 bg-opacity-95 z-50 transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } md:hidden`}
          >
            <div className="flex justify-between items-center p-4 border-b border-blue-800">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaWallet className="text-2xl text-blue-300" />
                <span className="font-bold text-xl">E-Commerce Wallet</span>
              </Link>
              <button 
                onClick={toggleMobileMenu}
                className="text-white p-2 hover:bg-blue-800 rounded-lg"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome className="text-xl text-blue-300" />
                <span className="text-lg">Home</span>
              </Link>
              
              <Link 
                to="/products" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingBag className="text-xl text-blue-300" />
                <span className="text-lg">Products</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/orders" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaClipboardList className="text-xl text-blue-300" />
                    <span className="text-lg">My Orders</span>
                  </Link>
                  
                  <Link 
                    to="/wallet" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaWallet className="text-xl text-blue-300" />
                    <span className="text-lg">Wallet: ₹{user?.wallet?.balance.toFixed(2) || '0.00'}</span>
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser className="text-xl text-blue-300" />
                    <span className="text-lg">Profile</span>
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      <FaShoppingCart className="text-xl text-blue-300" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <span className="text-lg">Cart</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 text-white"
                  >
                    <FaSignOutAlt className="text-xl text-blue-300" />
                    <span className="text-lg">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center p-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center p-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 