// routes/reservationRoutes.js
// This file's ONLY job: say "when this URL + HTTP method is hit,
// call this controller function." No logic lives here at all.

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// GET    /api/reservations       -> get all reservations
router.get('/', reservationController.getAllReservations);

// GET    /api/reservations/:id   -> get one reservation by id
router.get('/:id', reservationController.getReservationById);

// POST   /api/reservations       -> create a new reservation
router.post('/', reservationController.createReservation);

// PUT    /api/reservations/:id   -> update an existing reservation
router.put('/:id', reservationController.updateReservation);

// DELETE /api/reservations/:id   -> delete a reservation
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
