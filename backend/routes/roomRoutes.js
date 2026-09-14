// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         room_id:
 *           type: integer
 *         room_number:
 *           type: integer
 *         room_type:
 *           type: string
 *         price_per_night:
 *           type: number
 *         status:
 *           type: string
 *           enum: [available, occupied, maintenance]
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: A list of rooms
 */
router.get('/', roomController.getAllRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a room by id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The room was found
 *       404:
 *         description: Room not found
 */
router.get('/:id', roomController.getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room created
 *       400:
 *         description: Missing/invalid fields or duplicate room_number
 */
router.post('/', roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update an existing room
 *     tags: [Rooms]
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
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated
 *       404:
 *         description: Room not found
 */
router.put('/:id', roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted
 *       404:
 *         description: Room not found
 */
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
