const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const walletController = require('./walletController');
const { cashbackPercentages, maxWalletUsagePercentage } = require('../config/cashback');

exports.createOrder = async (req, res) => {
  try {
    const { products, paymentMethod, useWallet } = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }
    
    let totalAmount = 0;
    let orderProducts = [];
    let primaryCategory = null;
    
    for (const item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      if (!primaryCategory || cashbackPercentages[product.category] > cashbackPercentages[primaryCategory]) {
        primaryCategory = product.category;
      }
    }
    
    const orderData = {
      user: req.user.id,
      products: orderProducts,
      totalAmount,
      paymentMethod
    };
    
    if (useWallet && useWallet === true) {
      try {
        const maxWalletUsage = await walletController.calculateMaxWalletUsage(
          req.user.id,
          totalAmount,
          maxWalletUsagePercentage
        );
        
        if (maxWalletUsage.maxAmount > 0) {
          const order = new Order(orderData);
          await order.save();
          
          const walletUsage = await walletController.useWalletBalance(
            req.user.id,
            maxWalletUsage.maxAmount,
            order._id
          );
          
          order.walletAmountUsed = walletUsage.amountUsed;
          
          const remainingAmount = totalAmount - walletUsage.amountUsed;
          
          if (remainingAmount > 0) {
            const cashback = await walletController.addCashback(
              req.user.id,
              order._id,
              remainingAmount,
              primaryCategory
            );
            
            order.cashbackAmount = cashback.cashbackAmount;
          }
          
          await order.save();
          
          return res.status(201).json({
            success: true,
            order,
            walletUsed: walletUsage.amountUsed,
            cashbackAmount: order.cashbackAmount,
            newWalletBalance: walletUsage.newBalance
          });
        }
      } catch (error) {
        console.error('Wallet usage error:', error);
      }
    }
    
    const order = new Order(orderData);
    await order.save();
    
    const cashback = await walletController.addCashback(
      req.user.id,
      order._id,
      totalAmount,
      primaryCategory
    );
    
    order.cashbackAmount = cashback.cashbackAmount;
    await order.save();
    
    res.status(201).json({
      success: true,
      order,
      cashbackAmount: cashback.cashbackAmount,
      newWalletBalance: cashback.newBalance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to access this order' });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 