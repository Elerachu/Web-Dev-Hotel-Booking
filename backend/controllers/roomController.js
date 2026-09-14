// controllers/roomController.js
const roomModel = require('../models/roomModel');

// Matches the schema's ENUM for rooms.status
const VALID_STATUSES = ['available', 'occupied', 'maintenance'];

async function getAllRooms(req, res) {
  try {
    const rooms = await roomModel.getAllRooms();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: err.message });
  }
}

async function getRoomById(req, res) {
  try {
    const room = await roomModel.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch room', error: err.message });
  }
}

async function createRoom(req, res) {
  try {
    const { room_number, room_type, price_per_night, status } = req.body;

    if (!room_number || !room_type || !price_per_night) {
      return res.status(400).json({ message: 'room_number, room_type, and price_per_night are required' });
    }
    if (price_per_night <= 0) {
      return res.status(400).json({ message: 'price_per_night must be greater than 0' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const newId = await roomModel.createRoom(req.body);
    res.status(201).json({ message: 'Room created', room_id: newId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A room with that room_number already exists' });
    }
    res.status(500).json({ message: 'Failed to create room', error: err.message });
  }
}

async function updateRoom(req, res) {
  try {
    const { status } = req.body;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const affectedRows = await roomModel.updateRoom(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A room with that room_number already exists' });
    }
    res.status(500).json({ message: 'Failed to update room', error: err.message });
  }
}

async function deleteRoom(req, res) {
  try {
    const affectedRows = await roomModel.deleteRoom(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete room', error: err.message });
  }
}

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
