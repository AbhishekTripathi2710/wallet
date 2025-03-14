import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaWallet } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await login(formData);
        navigate(from);
      } catch (err) {
        console.error('Login error:', err);
        // Error is handled by the AuthContext
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
         style={{ 
           background: 'linear-gradient(135deg, #2c3e50 0%, #4a6572 100%)',
           minHeight: '100vh'
         }}>
      <div className="max-w-md w-full space-y-8 animate-fade-in" 
           style={{ 
             backgroundColor: 'rgba(255, 255, 255, 0.95)', 
             borderRadius: '1rem', 
             padding: '2rem',
             boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
           }}>
        <div className="text-center">
          <div className="flex justify-center">
            <div style={{ 
              backgroundColor: '#e74c3c',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 4px 10px rgba(231, 76, 60, 0.3)'
            }}>
              <FaWallet style={{ fontSize: '2rem', color: 'white' }} />
            </div>
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold" style={{ color: '#2c3e50' }}>
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: '#7f8c8d' }}>
            Sign in to access your account
          </p>
        </div>
        
        {error && (
          <div className="animate-slide-up" style={{ 
            backgroundColor: 'rgba(231, 76, 60, 0.1)', 
            borderLeft: '4px solid #e74c3c',
            padding: '1rem',
            borderRadius: '0 0.5rem 0.5rem 0'
          }}>
            <div className="flex items-center">
              <svg className="h-5 w-5" style={{ color: '#e74c3c' }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm" style={{ color: '#c0392b' }}>{error}</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#34495e' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope style={{ color: '#7f8c8d' }} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 py-3 border"
                  style={{ 
                    borderColor: formErrors.email ? '#e74c3c' : '#dfe6e9',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: '#2c3e50',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s',
                    boxShadow: formErrors.email ? '0 0 0 2px rgba(231, 76, 60, 0.2)' : 'none'
                  }}
                  placeholder="your@email.com"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c' }}>{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#34495e' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock style={{ color: '#7f8c8d' }} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 py-3 border"
                  style={{ 
                    borderColor: formErrors.password ? '#e74c3c' : '#dfe6e9',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: '#2c3e50',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s',
                    boxShadow: formErrors.password ? '0 0 0 2px rgba(231, 76, 60, 0.2)' : 'none'
                  }}
                  placeholder="••••••••"
                />
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c' }}>{formErrors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                style={{ 
                  width: '1rem', 
                  height: '1rem', 
                  borderRadius: '0.25rem',
                  borderColor: '#bdc3c7',
                  accentColor: '#e74c3c'
                }}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: '#7f8c8d' }}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" style={{ 
                color: '#e74c3c', 
                fontWeight: '500',
                transition: 'color 0.3s'
              }}>
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? '0.7' : '1',
                transition: 'all 0.3s',
                boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = '#c0392b';
                if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = '#e74c3c';
                if (!isSubmitting) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaSignInAlt style={{ marginRight: '0.5rem' }} />
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ 
                color: '#e74c3c', 
                fontWeight: '600',
                transition: 'color 0.3s'
              }}>
                Create one now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 