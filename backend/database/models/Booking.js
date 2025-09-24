const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  propertyId: {
    type: DataTypes.STRING,
    allowNull: false
    // Note: Foreign key reference removed for static Guesty data compatibility
  },
  propertyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'payment_failed', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guestEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guestName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guestPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  checkInTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  checkOutTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  guestyBookingId: {
    type: DataTypes.STRING,
    allowNull: true // For integration with Guesty
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  indexes: [
    {
      fields: ['propertyId']
    },
    {
      fields: ['startDate', 'endDate']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentIntentId']
    }
  ]
});

module.exports = Booking;
