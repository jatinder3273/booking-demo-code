import React, { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import './PaymentForm.css';

const PaymentForm = ({ 
  bookingData, 
  onPaymentSuccess, 
  onPaymentError, 
  onBack 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/create-payment-intent`, {
        totalAmount: bookingData.totalAmount,
        propertyId: bookingData.propertyId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        guests: bookingData.guests
      });
      
      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId || response.data.clientSecret.replace('_secret_mock', ''));
      setMockMode(response.data.mockMode);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize payment');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mockMode) {
        // Handle mock payment
        await handleMockPayment();
      } else {
        // Handle real Stripe payment
        await handleStripePayment();
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
      setIsLoading(false);
      onPaymentError && onPaymentError(err);
    }
  };

  const handleMockPayment = async () => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create booking with mock payment
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
      ...bookingData,
      paymentIntentId
    });
    
    setIsLoading(false);
    
    if (response.data.success) {
      onPaymentSuccess(response.data.booking);
    } else {
      throw new Error(response.data.message || 'Booking failed');
    }
  };

  const handleStripePayment = async () => {
    const cardElement = elements.getElement(CardElement);
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Guest', // In a real app, you'd collect this from a form
        },
      }
    });

    if (error) {
      throw new Error(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Create booking with successful payment
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
        ...bookingData,
        paymentIntentId: paymentIntent.id
      });
      
      setIsLoading(false);
      
      if (response.data.success) {
        onPaymentSuccess(response.data.booking);
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (!clientSecret && isLoading) {
    return (
      <div className="payment-form">
        <div className="payment-loading">
          <div className="loading-spinner"></div>
          <p>Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-form">
      <div className="payment-layout">
        {/* Left Side - Booking Summary */}
        <div className="booking-summary-section">
          <div className="payment-header">
            <button className="back-button" onClick={onBack}>
              <span className="back-icon">←</span>
              Back to Booking
            </button>
          </div>
          
          <div className="summary-card">
            <div className="summary-header">
              <div className="property-icon">🏠</div>
              <div className="summary-title">
                <h2>Booking Summary</h2>
                <p className="property-name">{bookingData.propertyName}</p>
              </div>
            </div>
            
            <div className="summary-details">
              <div className="detail-group">
                <div className="detail-item">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Check-in</span>
                    <span className="detail-value">{new Date(bookingData.startDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Check-out</span>
                    <span className="detail-value">{new Date(bookingData.endDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">👥</div>
                  <div className="detail-content">
                    <span className="detail-label">Guests</span>
                    <span className="detail-value">{bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}</span>
                  </div>
                </div>
              </div>
              
              <div className="pricing-summary">
                <div className="pricing-total">
                  <span className="total-label">Total Amount</span>
                  <span className="total-amount">${bookingData.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div className="payment-form-section">
          <div className="payment-card">
            <div className="payment-form-header">
              <h2>Complete Your Payment</h2>
              <p>You're just one step away from your perfect stay</p>
            </div>

            <form onSubmit={handleSubmit} className="payment-form-container">
              {mockMode ? (
                <div className="demo-payment-section">
                  <div className="demo-notice">
                    <div className="demo-icon">🧪</div>
                    <div className="demo-content">
                      <h3>Demo Mode Active</h3>
                      <p>This is a demonstration of the payment flow. No real charges will be made to any payment method.</p>
                      <p>Click "Complete Payment" below to simulate a successful transaction and complete your booking.</p>
                    </div>
                  </div>
                  
                  <div className="demo-card-display">
                    <div className="demo-card">
                      <div className="card-header">
                        <span className="card-type">DEMO</span>
                        <span className="card-chip">📱</span>
                      </div>
                      <div className="card-number">•••• •••• •••• 4242</div>
                      <div className="card-footer">
                        <span className="card-holder">Demo User</span>
                        <span className="card-expiry">12/26</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="real-payment-section">
                  <div className="payment-method-header">
                    <h3>Payment Information</h3>
                    <div className="accepted-cards">
                      <span className="card-icon">💳</span>
                      <span className="cards-text">We accept all major credit cards</span>
                    </div>
                  </div>
                  
                  <div className="card-element-wrapper">
                    <label className="card-label">Card Information</label>
                    <div className="card-element-container">
                      <CardElement
                        id="card-element"
                        options={cardElementOptions}
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="payment-error">
                  <span className="error-icon">⚠️</span>
                  <span className="error-message">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!stripe || isLoading}
                className="payment-submit-button"
              >
                {isLoading ? (
                  <div className="loading-content">
                    <div className="payment-spinner"></div>
                    <span>Processing your payment...</span>
                  </div>
                ) : (
                  <div className="submit-content">
                    <span className="submit-icon">🔐</span>
                    <span>Complete Payment • ${bookingData.totalAmount}</span>
                  </div>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
