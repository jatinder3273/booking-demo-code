const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  bookingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'id'
    }
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stripePaymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'usd'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true // e.g., 'card', 'bank_transfer', etc.
  },
  paymentProvider: {
    type: DataTypes.STRING,
    defaultValue: 'stripe'
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refundId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    {
      fields: ['bookingId']
    },
    {
      fields: ['paymentIntentId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Payment;
