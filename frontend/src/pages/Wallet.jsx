import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import WalletCard from '../components/WalletCard';
import { FaWallet, FaHistory, FaInfoCircle } from 'react-icons/fa';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/wallet' } });
      return;
    }

    const fetchWallet = async () => {
      try {
        setLoading(true);
        const response = await walletService.getWallet();
        setWallet(response.data.wallet);
      } catch (err) {
        console.error('Error fetching wallet:', err);
        setError('Failed to load wallet information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <FaInfoCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Wallet</h1>
        
        <div className="max-w-4xl mx-auto">
          {wallet && <WalletCard wallet={wallet} />}
          
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About Your Wallet</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FaWallet className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Cashback Earnings</h3>
                  <p className="text-gray-600">
                    Earn cashback on every purchase. Different product categories offer different cashback percentages.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <FaHistory className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Use Your Balance</h3>
                  <p className="text-gray-600">
                    You can use up to 90% of your wallet balance for future purchases. Simply select "Use Wallet" during checkout.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <FaInfoCircle className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Cashback Rates</h3>
                  <p className="text-gray-600">
                    Category A: 10% cashback<br />
                    Category B: 2% cashback<br />
                    Category C: 7% cashback
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet; 