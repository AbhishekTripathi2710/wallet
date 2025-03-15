import { useState, useEffect } from 'react';
import axios from 'axios';

const Debug = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the API URL from environment variables
    setApiUrl(import.meta.env.VITE_API_URL || 'Not set');
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      // Try to fetch products directly
      const response = await axios.get(`${apiUrl}/products`, { withCredentials: true });
      setApiResponse(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError({
        message: err.message,
        response: err.response?.data || 'No response data',
        status: err.response?.status || 'No status code'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>API Debug Tool</h2>
      <div style={{ marginBottom: '10px' }}>
        <strong>API URL:</strong> {apiUrl}
      </div>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <h3>Error:</h3>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>Status:</strong> {error.status}</p>
          <p><strong>Response:</strong></p>
          <pre style={{ 
            backgroundColor: '#f1f1f1', 
            padding: '10px', 
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
            {JSON.stringify(error.response, null, 2)}
          </pre>
        </div>
      )}
      
      {apiResponse && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          borderRadius: '4px',
          color: '#155724'
        }}>
          <h3>Success!</h3>
          <p><strong>Products Count:</strong> {apiResponse.count || apiResponse.products?.length || 'Unknown'}</p>
          <p><strong>Response:</strong></p>
          <pre style={{ 
            backgroundColor: '#f1f1f1', 
            padding: '10px', 
            borderRadius: '4px',
            overflowX: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Debug; 