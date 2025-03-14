import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaWallet, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data.order);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, isAuthenticated, navigate]);

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
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: '#e74c3c' }}>
        <FaExclamationCircle size={48} style={{ marginBottom: '1rem' }} />
        <p>{error}</p>
        <Link 
          to="/orders" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginTop: '1rem',
            color: '#3498db',
            textDecoration: 'none'
          }}
        >
          <FaArrowLeft /> Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: '#e74c3c' }}>
        <FaExclamationCircle size={48} style={{ marginBottom: '1rem' }} />
        <p>Order not found</p>
        <Link 
          to="/orders" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginTop: '1rem',
            color: '#3498db',
            textDecoration: 'none'
          }}
        >
          <FaArrowLeft /> Back to Orders
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/orders" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#3498db',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          <FaArrowLeft /> Back to Orders
        </Link>
      </div>

      <div className="card animate-fade-in">
        <div className="card-header" style={{ 
          backgroundColor: '#2c3e50', 
          color: 'white',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Order #{order._id.substring(order._id.length - 8)}
            </h1>
            <p style={{ opacity: 0.8 }}>Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div style={{ 
            backgroundColor: '#27ae60', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaCheckCircle /> {order.status || 'Completed'}
          </div>
        </div>

        <div className="card-body">
          <div className="row" style={{ marginBottom: '2rem' }}>
            <div className="col-6">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#2c3e50' }}>
                Order Summary
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#666' }}>Subtotal:</span>
                <span style={{ fontWeight: '500' }}>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              {order.walletAmountUsed > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FaWallet /> Wallet Amount Used:
                  </span>
                  <span style={{ fontWeight: '500', color: '#e74c3c' }}>-₹{order.walletAmountUsed.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#666' }}>Payment Method:</span>
                <span style={{ fontWeight: '500' }}>{order.paymentMethod}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eee',
                fontWeight: 'bold'
              }}>
                <span>Total Paid:</span>
                <span>₹{(order.totalAmount - (order.walletAmountUsed || 0)).toFixed(2)}</span>
              </div>
              {order.cashbackAmount > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(39, 174, 96, 0.1)',
                  borderRadius: '0.25rem',
                  color: '#27ae60',
                  fontWeight: '500'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FaWallet /> Cashback Earned:
                  </span>
                  <span>₹{order.cashbackAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#2c3e50' }}>
                Shipping Details
              </h3>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Name:</strong> {order.user?.name || 'User'}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {order.user?.email || 'Not available'}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Address:</strong> {order.shippingAddress || 'Standard Shipping Address'}
              </p>
            </div>
          </div>

          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#2c3e50' }}>
            Order Items
          </h3>
          <div style={{ 
            border: '1px solid #eee', 
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}>
            {order.products.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '1rem', 
                  display: 'flex', 
                  alignItems: 'center',
                  borderBottom: index < order.products.length - 1 ? '1px solid #eee' : 'none'
                }}
              >
                <div style={{ width: '60px', height: '60px', marginRight: '1rem' }}>
                  <img 
                    src={item.product?.image || 'https://via.placeholder.com/60'} 
                    alt={item.product?.name || 'Product'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.25rem' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    {item.product?.name || 'Product'}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    Quantity: {item.quantity} × ₹{item.price?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div style={{ fontWeight: '600' }}>
                  ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 