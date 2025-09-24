const { sequelize } = require('../config');
const Booking = require('./Booking');
const Payment = require('./Payment');

// Note: Property-Booking associations removed for static Guesty data compatibility
// Properties are now served from static data, not database

Booking.hasMany(Payment, {
  foreignKey: 'bookingId',
  as: 'payments'
});

Payment.belongsTo(Booking, {
  foreignKey: 'bookingId',
  as: 'booking'
});

// Sync database and create tables
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('📊 Database synchronized successfully');
    
    // Seed initial data if tables are empty
    await seedInitialData();
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
  }
};

// Note: Property seeding disabled - using static Guesty data instead
const seedInitialData = async () => {
  console.log('📋 Using static Guesty data - skipping property seeding');
};

module.exports = {
  sequelize,
  Booking,
  Payment,
  syncDatabase
};
