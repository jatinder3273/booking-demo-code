import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PropertyList.css';

const PropertyList = ({ onPropertySelect }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load properties. Make sure the backend server is running.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchProperties}>Retry</button>
      </div>
    );
  }

  return (
    <div className="property-list">
      <div className="properties-header">
        <h2>Discover Amazing Properties</h2>
        <p className="properties-subtitle">Find your perfect stay from our curated collection</p>
      </div>
      <div className="properties-grid">
        {properties.map(property => (
          <div key={property.id} className="property-card">
            <img 
              src={property.image} 
              alt={property.name}
              className="property-image"
            />
            <div className="property-info">
              <h3>{property.name}</h3>
              <p className="property-location">📍 {property.location}</p>
              <p className="property-description">{property.description}</p>
              
              {property.guestyData && (
                <div className="property-details-section">
                  <div className="property-stats">
                    <span className="stat">🛏️ {property.guestyData.beds} beds</span>
                    <span className="stat">🚿 {property.guestyData.baths} baths</span>
                    <span className="stat">🏠 {property.guestyData.propertyType}</span>
                  </div>
                  {property.guestyData.rating && (
                    <div className="rating-info">
                      <span className="rating">⭐ {property.guestyData.rating}</span>
                      <span className="reviews">({property.guestyData.reviewCount} reviews)</span>
                      {property.guestyData.instantBook && (
                        <span className="instant-book">⚡ Instant Book</span>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="property-details">
                <div className="amenities">
                  {property.amenities.slice(0, 3).map(amenity => (
                    <span key={amenity} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="amenity-tag">+{property.amenities.length - 3} more</span>
                  )}
                </div>
                
                <div className="property-footer">
                  <div className="price-info">
                    <span className="price">${property.pricePerNight}</span>
                    <span className="price-unit">/ night</span>
                  </div>
                  <div className="guest-info">
                    👥 Up to {property.maxGuests} guests
                  </div>
                </div>
              </div>
              
              <button 
                className="book-button"
                onClick={() => onPropertySelect(property)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
