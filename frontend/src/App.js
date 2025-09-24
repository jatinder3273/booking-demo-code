import React, { useState } from 'react';
import './App.css';
import PropertyList from './components/PropertyList';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key (for demo, we'll use a placeholder)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [currentView, setCurrentView] = useState('properties'); // 'properties', 'booking', 'confirmation'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setCurrentView('booking');
  };

  const handleBookingComplete = (booking) => {
    setBookingData(booking);
    setCurrentView('confirmation');
  };

  const handleBackToProperties = () => {
    setCurrentView('properties');
    setSelectedProperty(null);
    setBookingData(null);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <header className="app-header">
          <h1 onClick={handleBackToProperties} style={{ cursor: 'pointer' }}>
            🏠 Booking Demo
          </h1>
        </header>

        <main className="app-main">
          {currentView === 'properties' && (
            <PropertyList onPropertySelect={handlePropertySelect} />
          )}
          
          {currentView === 'booking' && selectedProperty && (
            <BookingForm 
              property={selectedProperty}
              onBookingComplete={handleBookingComplete}
              onBack={handleBackToProperties}
            />
          )}
          
          {currentView === 'confirmation' && bookingData && (
            <BookingConfirmation 
              booking={bookingData}
              onBackToProperties={handleBackToProperties}
            />
          )}
        </main>
      </div>
    </Elements>
  );
}

export default App;
