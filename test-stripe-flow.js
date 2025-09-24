const axios = require('axios');

async function testStripeFlow() {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Stripe Integration Flow...\n');
  
  try {
    // Test 1: Create Payment Intent
    console.log('1. Testing Payment Intent Creation...');
    const paymentIntentResponse = await axios.post(`${baseURL}/create-payment-intent`, {
      totalAmount: 240,
      propertyId: '1',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      guests: 2
    });
    
    console.log('✅ Payment Intent created successfully');
    console.log(`   Client Secret: ${paymentIntentResponse.data.clientSecret}`);
    console.log(`   Mock Mode: ${paymentIntentResponse.data.mockMode}`);
    
    // Test 2: Create Booking with Payment Intent
    console.log('\n2. Testing Booking Creation with Payment...');
    const paymentIntentId = paymentIntentResponse.data.clientSecret.replace('_secret_mock', '');
    
    const bookingResponse = await axios.post(`${baseURL}/bookings`, {
      propertyId: '1',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      guests: 2,
      totalAmount: 240,
      paymentIntentId
    });
    
    console.log('✅ Booking created successfully');
    console.log(`   Booking ID: ${bookingResponse.data.booking.id}`);
    console.log(`   Status: ${bookingResponse.data.booking.status}`);
    console.log(`   Payment Intent: ${bookingResponse.data.booking.paymentIntentId}`);
    
    // Test 3: Verify booking exists
    console.log('\n3. Testing Booking Retrieval...');
    const getBookingResponse = await axios.get(`${baseURL}/bookings/${bookingResponse.data.booking.id}`);
    
    console.log('✅ Booking retrieved successfully');
    console.log(`   Property: ${getBookingResponse.data.propertyName}`);
    console.log(`   Total: $${getBookingResponse.data.totalAmount}`);
    
    console.log('\n🎉 All Stripe integration tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Check if axios is available
try {
  testStripeFlow();
} catch (error) {
  console.log('Please install axios: npm install axios');
}
