// models/roomModel.js
const db = require('../config/database');

async function getAllRooms() {
  const [rows] = await db.query('SELECT * FROM rooms');
  return rows;
}

async function getRoomById(id) {
  const [rows] = await db.query(
    'SELECT * FROM rooms WHERE room_id = ?',
    [id]
  );
  return rows[0];
}

async function createRoom(data) {
  const { room_number, room_type, price_per_night, status } = data;
  const [result] = await db.query(
    'INSERT INTO rooms (room_number, room_type, price_per_night, status) VALUES (?, ?, ?, ?)',
    [room_number, room_type, price_per_night, status || 'available']
  );
  return result.insertId;
}

async function updateRoom(id, data) {
  const { room_number, room_type, price_per_night, status } = data;
  const [result] = await db.query(
    'UPDATE rooms SET room_number = ?, room_type = ?, price_per_night = ?, status = ? WHERE room_id = ?',
    [room_number, room_type, price_per_night, status, id]
  );
  return result.affectedRows;
}

async function deleteRoom(id) {
  const [result] = await db.query(
    'DELETE FROM rooms WHERE room_id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
