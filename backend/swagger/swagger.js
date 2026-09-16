// swagger/swagger.js
// This file sets up the Swagger "spec" — the rulebook that tells
// swagger-jsdoc where to look for documentation comments, and some
// basic info about the API itself.

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Booking Management System API',
      version: '1.0.0',
      description:
        'REST API for managing guests, rooms, and bookings for a small hotel. ' +
        'Most routes need a login: call POST /api/auth/login, copy the token, ' +
        'click "Authorize" and paste it in.'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    // every route needs the token unless the route says "security: []"
    security: [{ bearerAuth: [] }]
  },
  // Path(s) to files containing the @swagger annotations
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
