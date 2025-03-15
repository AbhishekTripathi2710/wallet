import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaWallet } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = formData;
        await register(userData);
        navigate('/');
      } catch (err) {
        console.error('Registration error:', err);
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
             position:'relative',
             maxWidth:'500px',
             display:'flex',
             alignItems:'center',
             justifyContent:'center',
             flexDirection:'column', 
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
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: '#7f8c8d' }}>
            Join our e-commerce platform today
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
              <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: '#34495e' }}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser style={{ color: '#7f8c8d' }} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 py-3 border"
                  style={{ 
                    borderColor: formErrors.name ? '#e74c3c' : '#dfe6e9',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: '#2c3e50',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s',
                    boxShadow: formErrors.name ? '0 0 0 2px rgba(231, 76, 60, 0.2)' : 'none'
                  }}
                  placeholder="John Doe"
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c' }}>{formErrors.name}</p>
              )}
            </div>
            
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
                  autoComplete="new-password"
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: '#34495e' }}>
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock style={{ color: '#7f8c8d' }} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 py-3 border"
                  style={{ 
                    borderColor: formErrors.confirmPassword ? '#e74c3c' : '#dfe6e9',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: '#2c3e50',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s',
                    boxShadow: formErrors.confirmPassword ? '0 0 0 2px rgba(231, 76, 60, 0.2)' : 'none'
                  }}
                  placeholder="••••••••"
                />
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c' }}>{formErrors.confirmPassword}</p>
              )}
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
              <FaUserPlus style={{ marginRight: '0.5rem' }} />
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ 
                color: '#e74c3c', 
                fontWeight: '600',
                transition: 'color 0.3s'
              }}>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 