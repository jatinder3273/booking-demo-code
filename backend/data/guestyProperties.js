/**
 * Static Guesty Mock Data
 * This file contains mock property data that mimics Guesty's API structure
 */

const guestyProperties = [
  {
    id: "guesty_1",
    title: "Luxury Beachfront Villa - Miami",
    accommodates: 8,
    beds: 4,
    baths: 3,
    address: {
      city: "Miami Beach",
      state: "FL",
      country: "US",
      full: "123 Ocean Drive, Miami Beach, FL, US"
    },
    pictures: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        caption: "Beachfront Villa Exterior"
      }
    ],
    prices: {
      basePrice: 450,
      currency: "USD"
    },
    amenities: [
      "Ocean View",
      "Private Pool", 
      "Beach Access",
      "WiFi",
      "Air Conditioning",
      "Full Kitchen",
      "Private Parking",
      "Hot Tub",
      "BBQ Grill"
    ],
    availability: {
      isAvailable: true,
      minStay: 3,
      maxStay: 30
    },
    description: "Stunning beachfront villa with direct ocean access. Perfect for families and groups looking for luxury accommodations with panoramic ocean views. Features a private pool, spacious deck, and modern amenities.",
    propertyType: "Villa",
    listingType: "entire_place",
    rating: 4.9,
    reviewCount: 127,
    instantBook: true
  },
  {
    id: "guesty_2", 
    title: "Downtown Luxury Apartment - NYC",
    accommodates: 4,
    beds: 2,
    baths: 2,
    address: {
      city: "New York",
      state: "NY", 
      country: "US",
      full: "456 Broadway, New York, NY, US"
    },
    pictures: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        caption: "Modern City Apartment"
      }
    ],
    prices: {
      basePrice: 280,
      currency: "USD"
    },
    amenities: [
      "City View",
      "WiFi",
      "Air Conditioning", 
      "Full Kitchen",
      "Gym Access",
      "24/7 Concierge",
      "Elevator",
      "Work Space",
      "Smart TV"
    ],
    availability: {
      isAvailable: true,
      minStay: 2,
      maxStay: 14
    },
    description: "Modern luxury apartment in the heart of Manhattan. Walking distance to Times Square, Broadway theaters, and world-class dining. Perfect for business travelers and city explorers.",
    propertyType: "Apartment",
    listingType: "entire_place", 
    rating: 4.8,
    reviewCount: 89,
    instantBook: true
  },
  {
    id: "guesty_3",
    title: "Mountain Cabin Retreat - Aspen",
    accommodates: 6,
    beds: 3,
    baths: 2,
    address: {
      city: "Aspen",
      state: "CO",
      country: "US", 
      full: "789 Mountain View Road, Aspen, CO, US"
    },
    pictures: [
      {
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        caption: "Mountain Cabin"
      }
    ],
    prices: {
      basePrice: 320,
      currency: "USD"
    },
    amenities: [
      "Mountain View",
      "Fireplace",
      "WiFi",
      "Heating",
      "Full Kitchen", 
      "Private Parking",
      "Ski Storage",
      "Hot Tub",
      "Game Room"
    ],
    availability: {
      isAvailable: true,
      minStay: 4,
      maxStay: 21
    },
    description: "Cozy mountain cabin with breathtaking views of the Rocky Mountains. Perfect for ski trips and mountain adventures. Features rustic charm with modern amenities.",
    propertyType: "Cabin",
    listingType: "entire_place",
    rating: 4.7,
    reviewCount: 156,
    instantBook: false
  },
  {
    id: "guesty_4",
    title: "Modern Loft - San Francisco",
    accommodates: 3,
    beds: 1,
    baths: 1,
    address: {
      city: "San Francisco",
      state: "CA",
      country: "US",
      full: "321 Mission Street, San Francisco, CA, US"
    },
    pictures: [
      {
        url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
        caption: "Modern Loft Interior"
      }
    ],
    prices: {
      basePrice: 195,
      currency: "USD"
    },
    amenities: [
      "City View",
      "WiFi",
      "Air Conditioning",
      "Kitchen",
      "Work Space",
      "Smart TV",
      "Coffee Machine",
      "Public Transit Access"
    ],
    availability: {
      isAvailable: true,
      minStay: 1,
      maxStay: 7
    },
    description: "Stylish modern loft in SOMA district. Perfect for business travelers and couples. Close to tech companies, restaurants, and public transportation.",
    propertyType: "Loft",
    listingType: "entire_place",
    rating: 4.6,
    reviewCount: 73,
    instantBook: true
  },
  {
    id: "guesty_5",
    title: "Lakefront Cottage - Lake Tahoe",
    accommodates: 7,
    beds: 3,
    baths: 2,
    address: {
      city: "Lake Tahoe",
      state: "CA",
      country: "US",
      full: "654 Lakeshore Drive, Lake Tahoe, CA, US"
    },
    pictures: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        caption: "Lakefront Cottage"
      }
    ],
    prices: {
      basePrice: 275,
      currency: "USD"
    },
    amenities: [
      "Lake View",
      "WiFi",
      "Full Kitchen",
      "Fireplace",
      "Private Dock",
      "Kayaks Included",
      "Fire Pit",
      "BBQ Grill",
      "Parking"
    ],
    availability: {
      isAvailable: true,
      minStay: 3,
      maxStay: 14
    },
    description: "Charming lakefront cottage with private dock and stunning lake views. Perfect for water activities and mountain relaxation. Includes kayaks and fishing equipment.",
    propertyType: "Cottage",
    listingType: "entire_place",
    rating: 4.8,
    reviewCount: 94,
    instantBook: false
  },
  {
    id: "guesty_6",
    title: "Historic Brownstone - Boston",
    accommodates: 5,
    beds: 3,
    baths: 2,
    address: {
      city: "Boston",
      state: "MA",
      country: "US",
      full: "987 Beacon Street, Boston, MA, US"
    },
    pictures: [
      {
        url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        caption: "Historic Brownstone"
      }
    ],
    prices: {
      basePrice: 235,
      currency: "USD"
    },
    amenities: [
      "Historic Character",
      "WiFi",
      "Full Kitchen",
      "Parking Space",
      "Garden Access",
      "Original Features",
      "Modern Updates",
      "Walking Distance to T"
    ],
    availability: {
      isAvailable: true,
      minStay: 2,
      maxStay: 10
    },
    description: "Beautiful historic brownstone in Back Bay. Combines classic Boston charm with modern amenities. Walking distance to museums, shopping, and public transportation.",
    propertyType: "Townhouse",
    listingType: "entire_place",
    rating: 4.5,
    reviewCount: 68,
    instantBook: true
  }
];

// Transform Guesty data to local property format
const transformToLocalFormat = (guestyProperty) => {
  return {
    id: guestyProperty.id,
    name: guestyProperty.title,
    image: guestyProperty.pictures[0]?.url || 'https://via.placeholder.com/800x600',
    pricePerNight: guestyProperty.prices.basePrice,
    location: `${guestyProperty.address.city}, ${guestyProperty.address.state}`,
    description: guestyProperty.description,
    maxGuests: guestyProperty.accommodates,
    amenities: guestyProperty.amenities,
    isActive: guestyProperty.availability.isAvailable,
    // Additional Guesty-specific fields
    guestyData: {
      beds: guestyProperty.beds,
      baths: guestyProperty.baths,
      propertyType: guestyProperty.propertyType,
      listingType: guestyProperty.listingType,
      minStay: guestyProperty.availability.minStay,
      maxStay: guestyProperty.availability.maxStay,
      rating: guestyProperty.rating,
      reviewCount: guestyProperty.reviewCount,
      instantBook: guestyProperty.instantBook,
      fullAddress: guestyProperty.address.full
    }
  };
};

// Export both raw and transformed data
module.exports = {
  guestyProperties,
  transformedProperties: guestyProperties.map(transformToLocalFormat),
  transformToLocalFormat
};
