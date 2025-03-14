import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaWallet, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const Orders = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getUserOrders();
        setOrders(response.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="animate-spin" style={{ 
          width: '3rem', 
          height: '3rem', 
          border: '3px solid #f3f3f3', 
          borderTop: '3px solid #3498db', 
          borderRadius: '50%', 
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: '#e74c3c' }}>
        <FaExclamationCircle size={48} style={{ marginBottom: '1rem' }} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem',
        color: '#2c3e50',
        textAlign: 'center'
      }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: 'white', 
          borderRadius: '0.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <FaShoppingBag size={48} style={{ color: '#95a5a6', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#2c3e50' }}>
            No Orders Yet
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link 
            to="/products" 
            className="btn" 
            style={{ 
              backgroundColor: '#3498db', 
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="animate-fade-in">
          {orders.map(order => (
            <div 
              key={order._id} 
              className="card" 
              style={{ 
                marginBottom: '1.5rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div className="card-body" style={{ padding: '1.5rem' }}>
                <div className="row">
                  <div className="col-6">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                      Order #{order._id.substring(order._id.length - 8)}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                      Placed on {formatDate(order.createdAt)}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      Payment Method: {order.paymentMethod}
                    </p>
                  </div>
                  <div className="col-6" style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                    {order.cashbackAmount > 0 && (
                      <p style={{ 
                        color: '#27ae60', 
                        fontSize: '0.875rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end',
                        gap: '0.25rem'
                      }}>
                        <FaWallet /> Cashback: ₹{order.cashbackAmount.toFixed(2)}
                      </p>
                    )}
                    <div style={{ 
                      display: 'inline-block',
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {order.products.slice(0, 3).map((item, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '0.25rem',
                        overflow: 'hidden',
                        border: '1px solid #eee'
                      }}
                    >
                      <img 
                        src={item.product?.image || 'https://via.placeholder.com/50'} 
                        alt={item.product?.name || 'Product'} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                  {order.products.length > 3 && (
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '0.25rem',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#666'
                    }}>
                      +{order.products.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 