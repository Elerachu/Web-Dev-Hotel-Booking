// config/database.js
// Creates a MySQL connection pool using credentials from environment variables.

require('dotenv').config(); // loads the values from .env into process.env

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // max number of connections kept in the pool
  queueLimit: 0,
  dateStrings: true // return DATE/DATETIME columns as plain strings instead of JS Date objects
});

const promisePool = pool.promise();

module.exports = promisePool;