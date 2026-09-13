// This file's job: receive the HTTP request (req), call the right
// model function and send back the HTTP response (res) with the
// right status code. It should NOT contain raw SQL.

const reservationModel = require('../models/reservationModel');

// GET /api/reservations
async function getAllReservations(req, res) {
  try {
    const reservations = await reservationModel.getAllReservations();
    res.status(200).json(reservations);
  } catch (err) {
    // 500 = something broke on our end (DB error, bug, etc.)
    // Never expose err.message details like DB credentials to the
    // client in a real production app but for a student project it's
    // okay and helps us debug from Swagger/Postman directly.
    res.status(500).json({ message: 'Failed to fetch reservations', error: err.message });
  }
}

// GET /api/reservations/:id
async function getReservationById(req, res) {
  try {
    const reservation = await reservationModel.getReservationById(req.params.id);

    // If the model returned nothing, no row matched that id.
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reservation', error: err.message });
  }
}

// POST /api/reservations
async function createReservation(req, res) {
  try {
    const { customer_id, table_id, reservation_date, reservation_time, number_of_people } = req.body;

    // Basic validation — the brief explicitly asks for this.
    // We check BEFORE touching the database, so we don't waste a
    // query on data we already know is invalid.
    if (!customer_id || !table_id || !reservation_date || !reservation_time || !number_of_people) {
      return res.status(400).json({ message: 'Missing required reservation fields' });
    }
    if (number_of_people <= 0) {
      return res.status(400).json({ message: 'Number of people must be greater than 0' });
    }

    const newId = await reservationModel.createReservation(req.body);

    // 201 = something was successfully CREATED (different from 200 = OK,
    // which is for successful reads/updates that don't create anything new).
    res.status(201).json({ message: 'Reservation created', reservation_id: newId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create reservation', error: err.message });
  }
}

// PUT /api/reservations/:id
async function updateReservation(req, res) {
  try {
    const affectedRows = await reservationModel.updateReservation(req.params.id, req.body);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update reservation', error: err.message });
  }
}

// DELETE /api/reservations/:id
async function deleteReservation(req, res) {
  try {
    const affectedRows = await reservationModel.deleteReservation(req.params.id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete reservation', error: err.message });
  }
}

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
