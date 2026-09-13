// routes/tableRoutes.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       properties:
 *         table_id:
 *           type: integer
 *         table_number:
 *           type: integer
 *         capacity:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [available, occupied, reserved]
 */

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: A list of tables
 */
router.get('/', tableController.getAllTables);

/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     summary: Get a table by id
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The table was found
 *       404:
 *         description: Table not found
 */
router.get('/:id', tableController.getTableById);

/**
 * @swagger
 * /api/tables:
 *   post:
 *     summary: Create a new table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       201:
 *         description: Table created
 *       400:
 *         description: Missing/invalid fields or duplicate table_number
 */
router.post('/', tableController.createTable);

/**
 * @swagger
 * /api/tables/{id}:
 *   put:
 *     summary: Update an existing table
 *     tags: [Tables]
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
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: Table updated
 *       404:
 *         description: Table not found
 */
router.put('/:id', tableController.updateTable);

/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *     summary: Delete a table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Table deleted
 *       404:
 *         description: Table not found
 */
router.delete('/:id', tableController.deleteTable);

module.exports = router;