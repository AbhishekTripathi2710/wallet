const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ['CREDIT', 'DEBIT'],
          required: true
        },
        amount: {
          type: Number,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema); 