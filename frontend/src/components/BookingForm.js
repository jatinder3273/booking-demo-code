import React, { useState } from 'react';
import axios from 'axios';
import { format, addDays, differenceInDays } from 'date-fns';
import PaymentForm from './PaymentForm';
import './BookingForm.css';

const BookingForm = ({ property, onBookingComplete, onBack }) => {
  const [bookingData, setBookingData] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    guests: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      
       const response = await axios.post(`${process.env.REACT_APP_API_URL}/properties/${property.id}/availability`, {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate
      });
      
      setAvailability(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to check availability');
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const days = differenceInDays(new Date(bookingData.endDate), new Date(bookingData.startDate));
    return days * property.pricePerNight;
  };

  const handleProceedToPayment = () => {
    // Check if availability was verified
    if (!availability?.available) {
      setError('Please check availability first');
      return;
    }
    
    setShowPayment(true);
  };

  const handlePaymentSuccess = (booking) => {
    onBookingComplete(booking);
  };

  const handlePaymentError = (error) => {
    setError(error.message || 'Payment failed');
    setShowPayment(false);
  };

  const handleBackFromPayment = () => {
    setShowPayment(false);
  };

  const totalAmount = calculateTotal();
  const nights = differenceInDays(new Date(bookingData.endDate), new Date(bookingData.startDate));

  // Show payment form if user clicked proceed to payment
  if (showPayment) {
    return (
      <PaymentForm
        bookingData={{
          propertyId: property.id,
          propertyName: property.name,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: parseInt(bookingData.guests),
          totalAmount
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        onBack={handleBackFromPayment}
      />
    );
  }

  return (
    <div className="booking-form">
      <div className="booking-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          Back to Properties
        </button>
      </div>
      
      <div className="booking-layout">
        {/* Property Details Section */}
        <div className="property-showcase">
          <div className="property-image-container">
            <img src={property.image} alt={property.name} className="property-hero-image" />
            <div className="image-overlay">
              <div className="property-badges">
                {property.guestyData?.instantBook && (
                  <span className="badge instant-book">⚡ Instant Book</span>
                )}
                {property.guestyData?.rating && (
                  <span className="badge rating">⭐ {property.guestyData.rating}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="property-main-info">
            <h1 className="property-title">{property.name}</h1>
            <div className="property-location">
              <span className="location-icon">📍</span>
              {property.location}
            </div>
            
            {property.guestyData && (
              <div className="property-features">
                <div className="feature">
                  <span className="feature-icon">🛏️</span>
                  <span>{property.guestyData.beds} beds</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🚿</span>
                  <span>{property.guestyData.baths} baths</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🏠</span>
                  <span>{property.guestyData.propertyType}</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">👥</span>
                  <span>Up to {property.maxGuests} guests</span>
                </div>
              </div>
            )}
            
            <div className="property-description">
              <h3>About this place</h3>
              <p>{property.description}</p>
            </div>
            
            <div className="property-amenities">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-checkmark">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
            
            {property.guestyData?.reviewCount > 0 && (
              <div className="property-reviews">
                <h3>Reviews</h3>
                <div className="review-summary">
                  <span className="review-rating">⭐ {property.guestyData.rating}</span>
                  <span className="review-count">({property.guestyData.reviewCount} reviews)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="booking-sidebar">
          <div className="booking-card">
            <div className="pricing-header">
              <span className="price-amount">${property.pricePerNight}</span>
              <span className="price-unit">per night</span>
            </div>
            
            <div className="booking-form-section">
              <h3>Reserve your stay</h3>
              
              <div className="date-inputs">
                <div className="input-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleInputChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="date-input"
                  />
                </div>

                <div className="input-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleInputChange}
                    min={bookingData.startDate}
                    className="date-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Guests</label>
                <select
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleInputChange}
                  className="guests-select"
                >
                  {[...Array(property.maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing Breakdown */}
              {nights > 0 && (
                <div className="pricing-breakdown">
                  <div className="pricing-row">
                    <span>${property.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span>${totalAmount}</span>
                  </div>
                  <div className="pricing-total">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Availability Check */}
              <button 
                className="check-availability-btn"
                onClick={checkAvailability}
                disabled={loading || nights <= 0}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Checking availability...
                  </>
                ) : (
                  'Check Availability'
                )}
              </button>

              {availability && (
                <div className={`availability-status ${availability.available ? 'available' : 'unavailable'}`}>
                  {availability.available ? (
                    <div className="status-content">
                      <div className="status-message">
                        <span className="status-icon">✅</span>
                        Available for selected dates!
                      </div>
                      <button 
                        className="book-now-btn"
                        onClick={handleProceedToPayment}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : `Reserve for $${totalAmount}`}
                      </button>
                    </div>
                  ) : (
                    <div className="status-content">
                      <div className="status-message">
                        <span className="status-icon">❌</span>
                        {availability.conflictReason || 'Not available for selected dates'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="error-alert">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="booking-notice">
                <div className="notice-icon">🔒</div>
                <div className="notice-text">
                  <strong>You won't be charged yet</strong>
                  <p>This is a demo application for testing purposes only.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
