/**
 * Test script for Static Guesty Data Integration
 * Tests all the API endpoints with the new static Guesty data
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

const logResponse = (endpoint, data) => {
  console.log(`\n🎯 ${endpoint}`);
  console.log('═'.repeat(60));
  console.log(JSON.stringify(data, null, 2));
  console.log('═'.repeat(60));
};

const logError = (endpoint, error) => {
  console.log(`\n❌ Error in ${endpoint}`);
  console.log('═'.repeat(60));
  console.log(error.response?.data || error.message);
  console.log('═'.repeat(60));
};

const testStaticGuestyIntegration = async () => {
  console.log('🏠 Static Guesty Data Integration Test');
  console.log('📋 Testing all endpoints with static Guesty data...\n');

  try {
    // 1. Test fetching all properties
    console.log('1️⃣ Fetching all static Guesty properties...');
    const propertiesResponse = await axios.get(`${BASE_URL}/properties`);
    logResponse('GET /api/properties', {
      totalProperties: propertiesResponse.data.length,
      sampleProperty: propertiesResponse.data[0],
      allPropertyIds: propertiesResponse.data.map(p => p.id)
    });

    // Get a sample property for further testing
    const sampleProperty = propertiesResponse.data[0];
    const propertyId = sampleProperty.id;

    // 2. Test fetching single property
    console.log(`\n2️⃣ Fetching single property (${propertyId})...`);
    const singlePropertyResponse = await axios.get(`${BASE_URL}/properties/${propertyId}`);
    logResponse(`GET /api/properties/${propertyId}`, singlePropertyResponse.data);

    // 3. Test availability check
    console.log(`\n3️⃣ Checking availability for property ${propertyId}...`);
    const availabilityResponse = await axios.post(`${BASE_URL}/properties/${propertyId}/availability`, {
      startDate: '2024-12-20',
      endDate: '2024-12-25'
    });
    logResponse(`POST /api/properties/${propertyId}/availability`, availabilityResponse.data);

    // 4. Test create payment intent
    console.log('\n4️⃣ Creating payment intent...');
    const paymentIntentResponse = await axios.post(`${BASE_URL}/create-payment-intent`, {
      totalAmount: sampleProperty.pricePerNight * 5, // 5 nights
      propertyId: propertyId,
      startDate: '2024-12-20',
      endDate: '2024-12-25',
      guests: 2
    });
    logResponse('POST /api/create-payment-intent', paymentIntentResponse.data);

    // 5. Test create booking
    console.log('\n5️⃣ Creating booking...');
    const bookingResponse = await axios.post(`${BASE_URL}/bookings`, {
      propertyId: propertyId,
      startDate: '2024-12-20',
      endDate: '2024-12-25',
      guests: 2,
      totalAmount: sampleProperty.pricePerNight * 5,
      paymentIntentId: paymentIntentResponse.data.clientSecret || 'pi_mock_test_12345'
    });
    logResponse('POST /api/bookings', bookingResponse.data);

    // 6. Test health endpoint
    console.log('\n6️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    logResponse('GET /api/health', healthResponse.data);

    // 7. Test data validation
    console.log('\n7️⃣ Validating Guesty data structure...');
    const validationResults = {
      totalProperties: propertiesResponse.data.length,
      allHaveGuestyData: propertiesResponse.data.every(p => p.guestyData),
      propertyTypes: [...new Set(propertiesResponse.data.map(p => p.guestyData?.propertyType))],
      priceRange: {
        min: Math.min(...propertiesResponse.data.map(p => p.pricePerNight)),
        max: Math.max(...propertiesResponse.data.map(p => p.pricePerNight))
      },
      locations: [...new Set(propertiesResponse.data.map(p => p.location))],
      averageRating: (propertiesResponse.data.reduce((sum, p) => sum + (p.guestyData?.rating || 0), 0) / propertiesResponse.data.length).toFixed(1),
      instantBookCount: propertiesResponse.data.filter(p => p.guestyData?.instantBook).length
    };
    logResponse('Data Validation Results', validationResults);

    console.log('\n✅ Static Guesty Integration Test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Total Properties: ${validationResults.totalProperties}`);
    console.log(`   • Property Types: ${validationResults.propertyTypes.join(', ')}`);
    console.log(`   • Price Range: $${validationResults.priceRange.min} - $${validationResults.priceRange.max}`);
    console.log(`   • Average Rating: ${validationResults.averageRating}/5.0`);
    console.log(`   • Instant Book Properties: ${validationResults.instantBookCount}`);
    console.log(`   • All endpoints working correctly`);
    
    console.log('\n💡 Frontend Testing:');
    console.log('   1. Open http://localhost:3000');
    console.log('   2. Check for "Powered by Guesty" badge');
    console.log('   3. Verify property cards show ratings, beds/baths, and property types');
    console.log('   4. Test booking flow with any property');
    console.log('   5. Look for enhanced property details');

  } catch (error) {
    logError('Static Guesty Integration Test', error);
    console.log('\n💡 Troubleshooting:');
    console.log('   • Make sure backend server is running: cd backend && npm start');
    console.log('   • Check if port 3001 is available');
    console.log('   • Verify the static data file exists: backend/data/guestyProperties.js');
  }
};

// Run the test
testStaticGuestyIntegration();
