// app.js
// This is the entry point — the file you actually run to start the server.
// Its job: set up Express, apply middleware, mount routers, and listen.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const reservationRoutes = require('./routes/reservationRoutes');
// Once Acher/you add customers and restaurant_tables, they'll be
// require'd and mounted here too, following the exact same pattern.

const app = express();

// --- Middleware ---
// Middleware runs on EVERY request, before it reaches your routes.
app.use(cors());         // allows your React app (different port) to call this API
app.use(express.json()); // parses incoming JSON request bodies into req.body
                          // without this, req.body would be undefined in your
                          // controller's createReservation/updateReservation functions

// --- Routes ---
// This is where "/" from reservationRoutes.js becomes "/api/reservations".
// Everything inside reservationRoutes.js is now prefixed with this path.
app.use('/api/reservations', reservationRoutes);

// Simple root route, just so visiting http://localhost:3000 shows
// something other than "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Restaurant Reservation API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
