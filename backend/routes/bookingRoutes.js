// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         booking_id:
 *           type: integer
 *         guest_id:
 *           type: integer
 *         room_id:
 *           type: integer
 *         check_in_date:
 *           type: string
 *           format: date
 *         check_out_date:
 *           type: string
 *           format: date
 *         total_price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, checked_in, checked_out, cancelled]
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: A list of bookings
 */
router.get('/', bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a booking by id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The booking was found
 *       404:
 *         description: Booking not found
 */
/**
 * @swagger
 * /api/bookings/details:
 *   get:
 *     summary: Get all bookings, with the guest's name and room number included
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: A list of bookings including guest_name and room_number
 */
router.get('/details', bookingController.getAllBookingsWithDetails);

router.get('/:id', bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/details:
 *   get:
 *     summary: Get a single booking, with the guest's name and room number included
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The booking including guest_name and room_number
 *       404:
 *         description: Booking not found
 */
router.get('/:id/details', bookingController.getBookingByIdWithDetails);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Missing/invalid fields, or check_out_date not after check_in_date
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update an existing booking (e.g. check-in / check-out status)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Booking updated
 *       404:
 *         description: Booking not found
 */
router.put('/:id', bookingController.updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking deleted
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;