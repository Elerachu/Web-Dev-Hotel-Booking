// routes/reportRoutes.js: dashboard summary and revenue report endpoints
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Counts for the dashboard cards (guests, rooms by status, active bookings, occupancy %)
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Dashboard summary numbers
 */
router.get('/summary', reportController.getSummary);

/**
 * @swagger
 * /api/reports/revenue:
 *   get:
 *     summary: Revenue for one year, by check-in month and by room type (cancelled bookings excluded)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2026
 *         description: Defaults to the current year
 *     responses:
 *       200:
 *         description: "{ year, years, totals, monthly[12], by_room_type[] }"
 *       400:
 *         description: Invalid year
 */
router.get('/revenue', reportController.getRevenue);

module.exports = router;
