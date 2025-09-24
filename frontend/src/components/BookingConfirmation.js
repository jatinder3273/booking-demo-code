import React from 'react';
import { format, parseISO } from 'date-fns';
import './BookingConfirmation.css';

const BookingConfirmation = ({ booking, onBackToProperties }) => {
  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMMM dd, yyyy');
  };
  console.log(booking, "booking");
  

  return (
    <div className="booking-confirmation">
      <div className="confirmation-background">
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}>✨</div>
          ))}
        </div>
      </div>
      
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-section">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark">✓</div>
            </div>
            <div className="celebration-icons">
              <span className="celebration-icon icon-1">🎉</span>
              <span className="celebration-icon icon-2">🏠</span>
              <span className="celebration-icon icon-3">🎊</span>
            </div>
          </div>
          
          <div className="success-content">
            <h1 className="success-title">Booking Confirmed!</h1>
            <p className="success-subtitle">
              Congratulations! Your reservation has been successfully processed.
            </p>
            <div className="confirmation-number">
              <span className="conf-label">Confirmation #</span>
              <span className="conf-value">{booking.id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="details-layout">
          {/* Booking Summary Card */}
          <div className="booking-summary-card">
            <div className="card-header">
              <h2>Your Booking Details</h2>
              <div className="status-badge confirmed">
                <span className="status-icon">✅</span>
                Confirmed
              </div>
            </div>
            
            <div className="property-info">
              <h3 className="property-name">{booking.propertyName}</h3>
            </div>
            
            <div className="booking-details-grid">
              <div className="detail-card">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">{formatDate(booking.startDate)}</span>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">{formatDate(booking.endDate)}</span>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">👥</div>
                <div className="detail-content">
                  <span className="detail-label">Guests</span>
                  <span className="detail-value">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>
              
              <div className="detail-card total-amount">
                <div className="detail-icon">💰</div>
                <div className="detail-content">
                  <span className="detail-label">Total Paid</span>
                  <span className="detail-value amount">${booking.totalAmount}</span>
                </div>
              </div>
            </div>
            
            <div className="payment-info">
              <div className="payment-status">
                <span className="payment-icon">💳</span>
                <span className="payment-text">Payment processed successfully</span>
              </div>
              <div className="payment-details">
                <span className="payment-id">Payment ID: {booking.paymentIntentId.slice(-12)}</span>
                <span className="booking-date">
                  Booked {format(parseISO(booking.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <div className="action-buttons">
            <button 
              className="primary-action-btn"
              onClick={onBackToProperties}
            >
              <span className="btn-icon">🏠</span>
              Book Another Property
            </button>
            
            <button 
              className="secondary-action-btn"
              onClick={() => window.print()}
            >
              <span className="btn-icon">📄</span>
              Print Confirmation
            </button>
          </div>
          
          <div className="help-section">
            <p>Need help with your booking?</p>
            <a href="mailto:support@example.com" className="support-link">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
