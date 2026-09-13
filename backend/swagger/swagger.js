// swagger/swagger.js
// This file sets up the Swagger "spec" — the rulebook that tells
// swagger-jsdoc where to look for documentation comments, and some
// basic info about the API itself.

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Reservation API',
      version: '1.0.0',
      description: 'REST API for managing customers, restaurant tables, and reservations'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ]
  },
  // This tells swagger-jsdoc: "scan every .js file inside routes/
  // and look for specially-formatted comments above each route."
  // We write those comments next.
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
