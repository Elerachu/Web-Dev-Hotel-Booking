// models/reservationModel.js
// This file ONLY talks to the database. No req/res here —
// that belongs in the controller. This file just runs SQL and
// returns data (or throws an error for the controller to catch).

const db = require('../config/database');

// READ — get every reservation
async function getAllReservations() {
  const [rows] = await db.query('SELECT * FROM reservations');
  return rows;
}

// READ — get one reservation by its ID
async function getReservationById(id) {
  // The "?" is a placeholder. We NEVER paste the id directly into
  // the SQL string (e.g. `WHERE reservation_id = ${id}`) because that
  // opens the door to SQL injection — a user could pass in something
  // like "1; DROP TABLE reservations;" as the id. mysql2 safely
  // escapes whatever goes into the [id] array before running the query.
  const [rows] = await db.query(
    'SELECT * FROM reservations WHERE reservation_id = ?',
    [id]
  );
  return rows[0]; // rows is an array — we just want the single match
}

// CREATE — add a new reservation
async function createReservation(data) {
  const { customer_id, table_id, reservation_date, reservation_time, number_of_people, status } = data;

  const [result] = await db.query(
    `INSERT INTO reservations
      (customer_id, table_id, reservation_date, reservation_time, number_of_people, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_id, table_id, reservation_date, reservation_time, number_of_people, status || 'pending']
  );

  // result.insertId is the auto-generated reservation_id MySQL just created.
  // We return it so the controller can send back the new record's ID.
  return result.insertId;
}

// UPDATE — modify an existing reservation
async function updateReservation(id, data) {
  const { customer_id, table_id, reservation_date, reservation_time, number_of_people, status } = data;

  const [result] = await db.query(
    `UPDATE reservations
     SET customer_id = ?, table_id = ?, reservation_date = ?,
         reservation_time = ?, number_of_people = ?, status = ?
     WHERE reservation_id = ?`,
    [customer_id, table_id, reservation_date, reservation_time, number_of_people, status, id]
  );

  // affectedRows tells us if a row actually matched and was updated.
  // If it's 0, the id didn't exist — useful for the controller to
  // decide between a 200 (updated) and a 404 (not found).
  return result.affectedRows;
}

// DELETE — remove a reservation
async function deleteReservation(id) {
  const [result] = await db.query(
    'DELETE FROM reservations WHERE reservation_id = ?',
    [id]
  );
  return result.affectedRows;
}

// Export all five functions so the controller can import and use them.
module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
