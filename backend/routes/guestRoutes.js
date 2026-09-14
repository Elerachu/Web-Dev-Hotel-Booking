// routes/guestRoutes.js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Guest:
 *       type: object
 *       properties:
 *         guest_id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         passport_number:
 *           type: string
 */

/**
 * @swagger
 * /api/guests:
 *   get:
 *     summary: Get all guests
 *     tags: [Guests]
 *     responses:
 *       200:
 *         description: A list of guests
 */
router.get('/', guestController.getAllGuests);

/**
 * @swagger
 * /api/guests/{id}:
 *   get:
 *     summary: Get a guest by id
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The guest was found
 *       404:
 *         description: Guest not found
 */
router.get('/:id', guestController.getGuestById);

/**
 * @swagger
 * /api/guests:
 *   post:
 *     summary: Create a new guest
 *     tags: [Guests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Guest'
 *     responses:
 *       201:
 *         description: Guest created
 *       400:
 *         description: Missing required fields or duplicate email/passport
 */
router.post('/', guestController.createGuest);

/**
 * @swagger
 * /api/guests/{id}:
 *   put:
 *     summary: Update an existing guest
 *     tags: [Guests]
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
 *             $ref: '#/components/schemas/Guest'
 *     responses:
 *       200:
 *         description: Guest updated
 *       404:
 *         description: Guest not found
 */
router.put('/:id', guestController.updateGuest);

/**
 * @swagger
 * /api/guests/{id}:
 *   delete:
 *     summary: Delete a guest
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Guest deleted
 *       404:
 *         description: Guest not found
 */
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
