const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
const {  isAfter, isBefore, parseISO } = require("date-fns");

// Database imports
const {
  syncDatabase,
  Booking,
  Payment,
} = require("./database/models/index");
const { testConnection } = require("./database/config");

// Static Guesty data
const { transformedProperties } = require("./data/guestyProperties");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const initializeDatabase = async () => {
  await testConnection();
  await syncDatabase();
};

// Routes

// Get all properties (Static Guesty Data)
app.get("/api/properties", async (req, res) => {
  try {
    console.log("📋 Serving static Guesty properties data");

    // Filter only active properties
    const activeProperties = transformedProperties.filter(
      (property) => property.isActive
    );

    res.json(activeProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// Get property by ID (Static Guesty Data)
app.get("/api/properties/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log(`🏠 Fetching static Guesty property: ${propertyId}`);

    const property = transformedProperties.find((p) => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// Check availability (Static Guesty Data)
app.post("/api/properties/:id/availability", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const propertyId = req.params.id;

    console.log(
      `🗓️ Checking availability for property ${propertyId} from ${startDate} to ${endDate}`
    );

    // Verify property exists in static data
    const property = transformedProperties.find((p) => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check against existing bookings in database
    const existingBookings = await Booking.count({
      where: {
        propertyId: propertyId,
        status: "confirmed",
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
    });
    const hasConflict = existingBookings > 0;
    res.json({
      available: !hasConflict,
      conflictReason: hasConflict
        ? "Property already booked for selected dates"
        : null,
      guestyData: property.guestyData,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Failed to check availability" });
  }
});

// Create Payment Intent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { totalAmount, propertyId, startDate, endDate, guests } = req.body;

    // Validate property exists in static Guesty data
    const property = transformedProperties.find((p) => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if we're using the real Stripe key (not the hardcoded fallback)
    const isUsingRealStripe = process.env.STRIPE_SECRET_KEY;

    if (!isUsingRealStripe) {
      // Return mock client secret for demo
      return res.json({
        clientSecret: "pi_mock_" + uuidv4() + "_secret_mock",
        mockMode: true,
      });
    }

    // Create Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      description: `Property booking for ${property.name} - ${guests} guests from ${startDate} to ${endDate}`, // Required for Indian regulations
      metadata: {
        propertyId,
        propertyName: property.name,
        startDate,
        endDate,
        guests: guests.toString(),
        booking_type: "property_rental",
        service_category: "accommodation",
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id, // Include the actual payment intent ID
      mockMode: false,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Create booking (after payment confirmation)
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      propertyId,
      startDate,
      endDate,
      guests,
      totalAmount,
      paymentIntentId,
    } = req.body;

    // Validate property exists in static Guesty data
    const property = transformedProperties.find((p) => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    console.log(
      `🏨 Creating booking for static Guesty property: ${property.name}`
    );

    // Check availability again
    const existingBookings = await Booking.findAll({
      where: {
        propertyId: propertyId,
        status: "confirmed",
      },
    });

    const hasConflict = existingBookings.some((booking) => {
      const bookingStart = parseISO(booking.startDate);
      const bookingEnd = parseISO(booking.endDate);
      const requestStart = parseISO(startDate);
      const requestEnd = parseISO(endDate);

      return (
        isBefore(requestStart, bookingEnd) && isAfter(requestEnd, bookingStart)
      );
    });

    if (hasConflict) {
      return res
        .status(400)
        .json({ error: "Property already booked for selected dates" });
    }

    // Create booking record in database
    const booking = await Booking.create({
      propertyId,
      propertyName: property.name,
      startDate,
      endDate,
      guests,
      totalAmount,
      status: "pending",
      paymentIntentId,
    });

    // Verify payment with Stripe (if not mock)
    const isUsingRealStripe = process.env.STRIPE_SECRET_KEY;

    if (paymentIntentId.startsWith("pi_mock_")) {
      // Mock payment success
      booking.status = "confirmed";
      console.log("🧪 Mock payment processed for booking:", booking.id);
    } else if (isUsingRealStripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        booking.status =
          paymentIntent.status === "succeeded" ? "confirmed" : "payment_failed";
        console.log(
          "💳 Stripe payment verified for booking:",
          booking.id,
          "Status:",
          paymentIntent.status
        );

        // Create payment record
        await Payment.create({
          bookingId: booking.id,
          paymentIntentId,
          amount: totalAmount,
          status: paymentIntent.status === "succeeded" ? "succeeded" : "failed",
          paymentMethod: "card",
          metadata: {
            stripePaymentIntentStatus: paymentIntent.status,
            propertyId,
            guests,
          },
        });
      } catch (stripeError) {
        console.error("❌ Stripe verification error:", stripeError.message);

        // Check if it's a "no such payment_intent" error
        if (
          stripeError.type === "invalid_request_error" &&
          stripeError.message.includes("No such payment_intent")
        ) {
          console.log(
            "🔍 Payment intent not found - possibly created with different Stripe account"
          );
          console.log(
            "💡 Using current account key:",
            process.env.STRIPE_SECRET_KEY.substring(0, 20) + "..."
          );
        }

        booking.status = "payment_failed";

        // Create failed payment record
        await Payment.create({
          bookingId: booking.id,
          paymentIntentId,
          amount: totalAmount,
          status: "failed",
          paymentMethod: "card",
          failureReason: stripeError.message,
          metadata: {
            errorType: stripeError.type,
            propertyId,
            guests,
          },
        });
      }
    } else {
      booking.status = "confirmed"; // Default mock mode
    }

    // Save booking status to database
    await booking.save();

    // Mock Guesty sync (in real implementation, you'd call Guesty API)
    console.log(
      `[MOCK GUESTY SYNC] Booking ${booking.id} synced to Guesty for property ${propertyId}`
    );

    res.json({
      success: true,
      booking,
      message:
        booking.status === "confirmed"
          ? "Booking confirmed successfully!"
          : "Payment failed",
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to process booking" });
  }
});

// Get booking by ID
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Property,
          as: "property",
        },
        {
          model: Payment,
          as: "payments",
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: "demo",
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      const isUsingRealStripe = process.env.STRIPE_SECRET_KEY;

      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API available at http://localhost:${PORT}/api`);
      console.log(
        `💳 Stripe integration: ${
          isUsingRealStripe ? "Live Stripe (Test Mode)" : "Mock (Demo Mode)"
        }`
      );

      if (isUsingRealStripe) {
        console.log(
          `🔑 Using Stripe Test Key: ${process.env.STRIPE_SECRET_KEY.substring(
            0,
            20
          )}...`
        );
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
