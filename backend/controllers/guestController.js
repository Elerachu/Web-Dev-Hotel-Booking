// controllers/guestController.js
const guestModel = require('../models/guestModel');

async function getAllGuests(req, res) {
  try {
    const guests = await guestModel.getAllGuests();
    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch guests', error: err.message });
  }
}

async function getGuestById(req, res) {
  try {
    const guest = await guestModel.getGuestById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch guest', error: err.message });
  }
}

async function createGuest(req, res) {
  try {
    const { name, phone, passport_number } = req.body;

    if (!name || !phone || !passport_number) {
      return res.status(400).json({ message: 'name, phone, and passport_number are required' });
    }

    const newId = await guestModel.createGuest(req.body);
    res.status(201).json({ message: 'Guest created', guest_id: newId });
  } catch (err) {
    // Both email and passport_number are UNIQUE in the schema, so
    // either one could trigger this same MySQL error code.
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A guest with that email or passport number already exists' });
    }
    res.status(500).json({ message: 'Failed to create guest', error: err.message });
  }
}

async function updateGuest(req, res) {
  try {
    const affectedRows = await guestModel.updateGuest(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.status(200).json({ message: 'Guest updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A guest with that email or passport number already exists' });
    }
    res.status(500).json({ message: 'Failed to update guest', error: err.message });
  }
}

async function deleteGuest(req, res) {
  try {
    const affectedRows = await guestModel.deleteGuest(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    // Deleting a guest cascades to delete their bookings too,
    // same ON DELETE CASCADE pattern as before.
    res.status(200).json({ message: 'Guest deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete guest', error: err.message });
  }
}

module.exports = {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
};
