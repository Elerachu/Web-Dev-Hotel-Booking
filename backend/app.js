// app.js
// Entry point: wires up middleware, mounts routes, serves Swagger docs,
// and starts the server.

require('dotenv').config();

// Login tokens are signed with this secret. Without it no one can log in, so stop early with a clear message.
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Add a line like JWT_SECRET=some-long-random-text to your .env file.');
  process.exit(1);
}
const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const authRoutes = require('./routes/authRoutes');
const guestRoutes = require('./routes/guestRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { requireAuth } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());// allows the React app (different port) to call this API
app.use(express.json());
// sign that the api is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hotel Booking API is running. See /api-docs for documentation.' });
});

// Health check for confirming the server + DB are both up
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Uploaded admin photos, e.g. /uploads/admins/admin-1-1789544678478.png
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
// /api/auth decides per route whether a login is needed (see routes/authRoutes.js).
// Everything else is hotel data, so a logged-in admin is required.
app.use('/api/auth', authRoutes);
app.use('/api/guests', requireAuth, guestRoutes);
app.use('/api/rooms', requireAuth, roomRoutes);
app.use('/api/bookings', requireAuth, bookingRoutes);
app.use('/api/reports', requireAuth, reportRoutes);

// Swagger docs, served at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler for any route that isn't matched above
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Centralized error handler (catches anything that slips past a controller's try/catch)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Hotel Booking API running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
