// config/database.js
// This file sets up ONE connection pool that the rest of the app reuses.
// A "pool" is a small group of ready-to-use connections, instead of
// opening a brand new connection to MySQL on every single request
// (which would be slow and can exhaust MySQL's max connections).

require('dotenv').config(); // loads the values from .env into process.env

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // max number of connections kept in the pool
  queueLimit: 0
});

// .promise() lets us use async/await instead of older callback-style code.
// Without this, every query would need a callback function — promise()
// gives us the cleaner, more modern syntax.
const promisePool = pool.promise();

module.exports = promisePool;
