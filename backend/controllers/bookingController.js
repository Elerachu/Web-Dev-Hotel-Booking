// controllers/bookingController.js
const bookingModel = require('../models/bookingModel');

// Matches the schema's ENUM for bookings.status
const VALID_STATUSES = ['pending', 'checked_in', 'checked_out', 'cancelled'];

async function getAllBookings(req, res) {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
}

async function getBookingById(req, res) {
  try {
    const booking = await bookingModel.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking', error: err.message });
  }
}

async function createBooking(req, res) {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, total_price } = req.body;

    if (!guest_id || !room_id || !check_in_date || !check_out_date || !total_price) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }
    if (total_price <= 0) {
      return res.status(400).json({ message: 'total_price must be greater than 0' });
    }
    // A booking where checkout is before (or the same as) check-in
    // doesn't make sense — this is a good example of "business logic"
    // validation, beyond just checking a field isn't empty.
    if (new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'check_out_date must be after check_in_date' });
    }
    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const newId = await bookingModel.createBooking(req.body);
    res.status(201).json({ message: 'Booking created', booking_id: newId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
}

async function updateBooking(req, res) {
  try {
    const { status, check_in_date, check_out_date } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    if (check_in_date && check_out_date && new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'check_out_date must be after check_in_date' });
    }

    const affectedRows = await bookingModel.updateBooking(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking', error: err.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const affectedRows = await bookingModel.deleteBooking(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
