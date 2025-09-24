const { Sequelize } = require('sequelize');
const path = require('path');

// Create SQLite database in the database folder
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'booking_demo.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('📊 Database connection established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, testConnection };
