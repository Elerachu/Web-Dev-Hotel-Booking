// This is the entry point — the file ran to start the server.
// Its job: set up Express, apply middleware, mount routers, and listen.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const guestRoutes = require('./routes/guestRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const tableRoutes = require('./routes/tableRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express();

// --- Middleware ---
// Middleware runs on EVERY request, before it reaches your routes.
app.use(cors());         // allows the React app (different port) to call this API
app.use(express.json());// parses incoming JSON request bodies into req.body without this,
// req.body would be undefined in your controller's createReservation/updateReservation functions

// --- Routes ---
app.use('/api/reservations', reservationRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/tables', tableRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Simple root route, just so visiting http://localhost:3000 shows

app.get('/', (req, res) => {
  res.send('Restaurant Reservation API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
