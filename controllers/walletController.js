const User = require('../models/User');
const { cashbackPercentages } = require('../config/cashback');

// Get wallet balance and transaction history
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      wallet: {
        balance: user.wallet.balance,
        transactions: user.wallet.transactions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add cashback to user's wallet
exports.addCashback = async (userId, orderId, totalAmount, productCategory) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Calculate cashback amount based on product category
    const cashbackPercentage = cashbackPercentages[productCategory] || 0;
    const cashbackAmount = (totalAmount * cashbackPercentage) / 100;
    
    // Add cashback to wallet balance
    user.wallet.balance += cashbackAmount;
    
    // Add transaction record
    user.wallet.transactions.push({
      type: 'CREDIT',
      amount: cashbackAmount,
      description: `Cashback for order #${orderId} (${cashbackPercentage}% of ${totalAmount})`,
      orderId: orderId
    });
    
    await user.save();
    
    return {
      success: true,
      cashbackAmount,
      newBalance: user.wallet.balance
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Use wallet balance for purchase
exports.useWalletBalance = async (userId, amount, orderId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if user has sufficient balance
    if (user.wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }
    
    // Deduct amount from wallet balance
    user.wallet.balance -= amount;
    
    // Add transaction record
    user.wallet.transactions.push({
      type: 'DEBIT',
      amount: amount,
      description: `Used for order #${orderId}`,
      orderId: orderId
    });
    
    await user.save();
    
    return {
      success: true,
      amountUsed: amount,
      newBalance: user.wallet.balance
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Calculate maximum wallet amount that can be used for a purchase
exports.calculateMaxWalletUsage = async (userId, totalAmount, maxPercentage = 100) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Calculate maximum amount that can be used from wallet
    const maxAmount = Math.min(
      user.wallet.balance,
      totalAmount,
      (totalAmount * maxPercentage) / 100
    );
    
    return {
      success: true,
      maxAmount,
      currentBalance: user.wallet.balance
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 