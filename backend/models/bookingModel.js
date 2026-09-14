// models/bookingModel.js
const db = require('../config/database');

async function getAllBookings() {
  const [rows] = await db.query('SELECT * FROM bookings');
  return rows;
}

async function getBookingById(id) {
  const [rows] = await db.query(
    'SELECT * FROM bookings WHERE booking_id = ?',
    [id]
  );
  return rows[0];
}

async function createBooking(data) {
  const { guest_id, room_id, check_in_date, check_out_date, total_price, status } = data;

  const [result] = await db.query(
    `INSERT INTO bookings
      (guest_id, room_id, check_in_date, check_out_date, total_price, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [guest_id, room_id, check_in_date, check_out_date, total_price, status || 'pending']
  );
  return result.insertId;
}

async function updateBooking(id, data) {
  const { guest_id, room_id, check_in_date, check_out_date, total_price, status } = data;

  const [result] = await db.query(
    `UPDATE bookings
     SET guest_id = ?, room_id = ?, check_in_date = ?,
         check_out_date = ?, total_price = ?, status = ?
     WHERE booking_id = ?`,
    [guest_id, room_id, check_in_date, check_out_date, total_price, status, id]
  );
  return result.affectedRows;
}

async function deleteBooking(id) {
  const [result] = await db.query(
    'DELETE FROM bookings WHERE booking_id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
