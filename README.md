# Booking Demo Project

A full-stack booking application demo featuring property listings, booking management, and Stripe payment integration.

## 🏗️ Project Structure

```
booking-demo/
├── backend/          # Node.js/Express API server
├── frontend/         # React application
└── README.md         # This file
```

## 🛠️ Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

## 🚀 Quick Setup

### 1. Clone the Repository (if needed)

```bash
git clone <repository-url>
cd booking-demo
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Create environment file:
```bash
cp env.example .env
```

Edit `.env` file with your configuration:
```env
# Stripe Configuration (Get these from your Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_51LxPTfSBvNFjWiR....
STRIPE_PUBLISHABLE_KEY=pk_test_51LxPTfS...

# Server Configuration
PORT=3001

# For demo purposes, you can leave Stripe keys empty and it will use mock payments
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
```

Create environment file:
```bash
cp env.example .env
```

Edit `.env` file:
```env
# Stripe Configuration (optional - demo works without these)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51SAqEV...

# Backend API URL (change if deploying)
REACT_APP_API_URL=http://localhost:3001/api
```

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

### Start Frontend Application

Open a new terminal window:

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000`

## 📊 Database

The application uses SQLite database with Sequelize ORM. The database file is located at:
```
backend/database/booking_demo.sqlite
```

The database will be automatically created and synchronized when you start the backend server for the first time.

## 🔧 Configuration Options

### Backend Configuration (backend/.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key for payment processing | Yes* | - |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes* | - |
| `PORT` | Backend server port | No | 3001 |

*The demo works with mock payments if Stripe keys are not provided.

### Frontend Configuration (frontend/.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for frontend | Yes | - |
| `REACT_APP_API_URL` | Backend API URL | Yes | http://localhost:3001/api |

## 🎯 Features

- **Property Listings**: Browse available properties
- **Booking Management**: Create and manage bookings
- **Payment Processing**: Integrated Stripe payments (with mock fallback)
- **Availability Checking**: Real-time availability validation
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Development

### Backend Development

The backend is built with:
- **Express.js**: Web framework
- **Sequelize**: ORM for database operations
- **SQLite**: Database
- **Stripe**: Payment processing
- **CORS**: Cross-origin resource sharing

### Frontend Development

The frontend is built with:
- **React**: UI framework
- **Axios**: HTTP client
- **Stripe React Components**: Payment UI
- **CSS**: Custom styling

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in backend/.env
2. **CORS errors**: Ensure backend is running and accessible
3. **Payment failures**: Check Stripe configuration or use mock mode
4. **Database errors**: Delete the SQLite file to reset the database

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📝 API Endpoints

- `GET /api/health` - Health check
- `GET /api/properties` - List all properties
- `POST /api/properties/:id/availability` - Check availability
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/payments/process` - Process payment

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure production Stripe keys
3. Update `REACT_APP_API_URL` to production backend URL
4. Build frontend: `npm run build`
5. Serve static files and run backend server
