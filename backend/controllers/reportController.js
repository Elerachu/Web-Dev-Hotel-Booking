// controllers/reportController.js: shapes the dashboard summary and revenue data for the frontend
const reportModel = require('../models/reportModel');

// MySQL DECIMAL columns arrive as strings like "120.00"; convert them to numbers
const toNumber = (value) => Number(value || 0);

// GET /api/reports/summary
async function getSummary(req, res) {
  try {
    const row = await reportModel.getSummary();
    const totalRooms = toNumber(row.total_rooms);
    const occupiedRooms = toNumber(row.occupied_rooms);

    res.status(200).json({
      total_guests: toNumber(row.total_guests),
      total_rooms: totalRooms,
      available_rooms: toNumber(row.available_rooms),
      occupied_rooms: occupiedRooms,
      maintenance_rooms: toNumber(row.maintenance_rooms),
      active_bookings: toNumber(row.active_bookings),
      // share of all rooms that are occupied right now, as a whole percentage
      occupancy_rate: totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summary', error: err.message });
  }
}

// GET /api/reports/revenue?year=2026
async function getRevenue(req, res) {
  try {
    const currentYear = new Date().getFullYear();
    const year = req.query.year ? Number(req.query.year) : currentYear;

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ message: 'year must be a four-digit year, e.g. 2026' });
    }

    const [bookingYears, monthlyRows, roomTypeRows] = await Promise.all([
      reportModel.getRevenueYears(),
      reportModel.getMonthlyRevenue(year),
      reportModel.getRevenueByRoomType(year)
    ]);

    // Always return all 12 months so the chart has a full x-axis, even for empty months
    const monthly = Array.from({ length: 12 }, (_, index) => {
      const row = monthlyRows.find((r) => Number(r.month) === index + 1) || {};
      return {
        month: `${year}-${String(index + 1).padStart(2, '0')}`,
        earned: toNumber(row.earned),
        in_house: toNumber(row.in_house),
        expected: toNumber(row.expected),
        cancelled: toNumber(row.cancelled),
        bookings: toNumber(row.bookings)
      };
    });

    const sum = (key) => monthly.reduce((total, m) => total + m[key], 0);
    const totals = {
      earned: sum('earned'),
      in_house: sum('in_house'),
      expected: sum('expected'),
      cancelled: sum('cancelled'),
      bookings: sum('bookings')
    };
    totals.total = totals.earned + totals.in_house + totals.expected;

    const years = Array.from(new Set([currentYear, year, ...bookingYears])).sort((a, b) => b - a);

    res.status(200).json({
      year,
      years,
      totals,
      monthly,
      by_room_type: roomTypeRows.map((r) => ({
        room_type: r.room_type,
        revenue: toNumber(r.revenue),
        bookings: toNumber(r.bookings)
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch revenue', error: err.message });
  }
}

module.exports = { getSummary, getRevenue };
