// models/guestModel.js
const db = require('../config/database');

async function getAllGuests() {
  const [rows] = await db.query('SELECT * FROM guests');
  return rows;
}

async function getGuestById(id) {
  const [rows] = await db.query(
    'SELECT * FROM guests WHERE guest_id = ?',
    [id]
  );
  return rows[0];
}

async function createGuest(data) {
  const { name, email, phone, passport_number } = data;
  const [result] = await db.query(
    'INSERT INTO guests (name, email, phone, passport_number) VALUES (?, ?, ?, ?)',
    [name, email, phone, passport_number]
  );
  return result.insertId;
}

async function updateGuest(id, data) {
  const { name, email, phone, passport_number } = data;
  const [result] = await db.query(
    'UPDATE guests SET name = ?, email = ?, phone = ?, passport_number = ? WHERE guest_id = ?',
    [name, email, phone, passport_number, id]
  );
  return result.affectedRows;
}

async function deleteGuest(id) {
  const [result] = await db.query(
    'DELETE FROM guests WHERE guest_id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
};
