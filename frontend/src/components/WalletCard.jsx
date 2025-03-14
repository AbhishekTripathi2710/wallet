import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const WalletCard = ({ wallet }) => {
  const { balance, transactions } = wallet;

  return (
    <div className="card">
      <div style={{ backgroundColor: '#0066cc', padding: '1.5rem', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Your Wallet</h2>
            <p style={{ color: '#cce5ff' }}>Manage your cashback and payments</p>
          </div>
          <div style={{ fontSize: '2.5rem' }}>
            <FaWallet />
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: '#cce5ff', fontSize: '0.875rem' }}>Available Balance</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{balance.toFixed(2)}</h1>
        </div>
      </div>

      <div className="card-body">
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Transactions</h3>
        
        {transactions && transactions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.slice(0, 5).map((transaction, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e9ecef', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    borderRadius: '50%', 
                    marginRight: '0.75rem',
                    backgroundColor: transaction.type === 'CREDIT' ? '#d4edda' : '#f8d7da',
                    color: transaction.type === 'CREDIT' ? '#28a745' : '#dc3545'
                  }}>
                    {transaction.type === 'CREDIT' ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                  <div>
                    <p style={{ fontWeight: '500' }}>{transaction.description}</p>
                    <p style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={{ 
                  fontWeight: 'bold',
                  color: transaction.type === 'CREDIT' ? '#28a745' : '#dc3545'
                }}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#6c757d' }}>
            No transactions yet
          </div>
        )}
        
        {transactions && transactions.length > 5 && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button className="btn btn-link" style={{ color: '#0066cc', fontWeight: '500' }}>
              View All Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard; 