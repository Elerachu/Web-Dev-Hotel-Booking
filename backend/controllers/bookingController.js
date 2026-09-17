// controllers/bookingController.js
const bookingModel = require('../models/bookingModel');
const roomModel = require('../models/roomModel');

// Matches the schema's ENUM for bookings.status
const VALID_STATUSES = ['pending', 'checked_in', 'checked_out', 'cancelled'];

// function to keep booking and room status in sync
async function syncRoomStatus(previous, next) {
  const wasInHouse = previous && previous.status === 'checked_in';
  const isInHouse = next && next.status === 'checked_in';
  const roomChanged = previous && next && Number(previous.room_id) !== Number(next.room_id);

  if (wasInHouse && (!isInHouse || roomChanged)) {
    await roomModel.setRoomStatus(previous.room_id, 'available', 'occupied');
  }
  if (isInHouse) {
    await roomModel.setRoomStatus(next.room_id, 'occupied');
  }
}

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

async function getAllBookingsWithDetails(req, res) {
  try {
    const bookings = await bookingModel.getAllBookingsWithDetails();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking details', error: err.message });
  }
}

async function getBookingByIdWithDetails(req, res) {
  try {
    const booking = await bookingModel.getBookingByIdWithDetails(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking details', error: err.message });
  }
}

async function createBooking(req, res) {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, total_price, status } =
      req.body;

    if (!guest_id || !room_id || !check_in_date || !check_out_date || total_price == null) {
      return res.status(400).json({
        message:
          'guest_id, room_id, check_in_date, check_out_date and total_price are required'
      });
    }
    if (new Date(check_out_date) <= new Date(check_in_date)) {
      return res
        .status(400)
        .json({ message: 'check_out_date must be after check_in_date' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const newId = await bookingModel.createBooking({
      guest_id,
      room_id,
      check_in_date,
      check_out_date,
      total_price,
      status
    });

    await syncRoomStatus(null, { room_id, status });

    const created = await bookingModel.getBookingByIdWithDetails(newId);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return res
        .status(400)
        .json({ message: 'guest_id or room_id does not refer to an existing record' });
    }
    console.error('createBooking error:', err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
}


async function updateBooking(req, res) {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, total_price, status } =
      req.body;

    if (
      !guest_id ||
      !room_id ||
      !check_in_date ||
      !check_out_date ||
      total_price == null ||
      !status
    ) {
      return res.status(400).json({
        message:
          'guest_id, room_id, check_in_date, check_out_date, total_price and status are required'
      });
    }
    if (new Date(check_out_date) <= new Date(check_in_date)) {
      return res
        .status(400)
        .json({ message: 'check_out_date must be after check_in_date' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    // read the booking before changing it, so we know which room it was in and its old status
    const previous = await bookingModel.getBookingById(req.params.id);
    if (!previous) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await bookingModel.updateBooking(req.params.id, {
      guest_id,
      room_id,
      check_in_date,
      check_out_date,
      total_price,
      status
    });

    await syncRoomStatus(previous, { room_id, status });

    const updated = await bookingModel.getBookingByIdWithDetails(req.params.id);
    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return res
        .status(400)
        .json({ message: 'guest_id or room_id does not refer to an existing record' });
    }
    console.error('updateBooking error:', err);
    res.status(500).json({ message: 'Failed to update booking' });
  }
}

async function deleteBooking(req, res) {
  try {
    const previous = await bookingModel.getBookingById(req.params.id);
    if (!previous) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await bookingModel.deleteBooking(req.params.id);
    await syncRoomStatus(previous, null);
    res.status(200).json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
}

module.exports = {
  getAllBookings,
  getBookingById,
  getAllBookingsWithDetails,
  getBookingByIdWithDetails,
  createBooking,
  updateBooking,
  deleteBooking
};
