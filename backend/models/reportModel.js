// models/reportModel.js: read-only queries for the dashboard numbers and the revenue page
const db = require('../config/database');

// One query that counts everything the dashboard's four cards need.
async function getSummary() {
  const [rows] = await db.query(
    `SELECT
        (SELECT COUNT(*) FROM guests) AS total_guests,
        (SELECT COUNT(*) FROM rooms) AS total_rooms,
        (SELECT COUNT(*) FROM rooms WHERE status = 'available') AS available_rooms,
        (SELECT COUNT(*) FROM rooms WHERE status = 'occupied') AS occupied_rooms,
        (SELECT COUNT(*) FROM rooms WHERE status = 'maintenance') AS maintenance_rooms,
        (SELECT COUNT(*) FROM bookings WHERE status IN ('pending', 'checked_in')) AS active_bookings`
  );
  return rows[0];
}

// Years that have at least one booking, newest first
async function getRevenueYears() {
  const [rows] = await db.query(
    'SELECT DISTINCT YEAR(check_in_date) AS year FROM bookings ORDER BY year DESC'
  );
  return rows.map((row) => Number(row.year));
}

// Revenue per check-in month for one year, split by booking status.
// A date range (instead of YEAR(check_in_date) = ?) lets MySQL use an index on the column later.
async function getMonthlyRevenue(year) {
  const [rows] = await db.query(
    `SELECT
        MONTH(check_in_date) AS month,
        SUM(CASE WHEN status = 'checked_out' THEN total_price ELSE 0 END) AS earned,
        SUM(CASE WHEN status = 'checked_in'  THEN total_price ELSE 0 END) AS in_house,
        SUM(CASE WHEN status = 'pending'     THEN total_price ELSE 0 END) AS expected,
        SUM(CASE WHEN status = 'cancelled'   THEN total_price ELSE 0 END) AS cancelled,
        SUM(CASE WHEN status <> 'cancelled'  THEN 1 ELSE 0 END) AS bookings
     FROM bookings
     WHERE check_in_date >= ? AND check_in_date < ?
     GROUP BY MONTH(check_in_date)
     ORDER BY month`,
    [`${year}-01-01`, `${year + 1}-01-01`]
  );
  return rows;
}

// Revenue per room type for one year. Room type lives in the rooms table,
// so this JOINs bookings to rooms. Cancelled bookings are left out.
async function getRevenueByRoomType(year) {
  const [rows] = await db.query(
    `SELECT
        r.room_type,
        SUM(b.total_price) AS revenue,
        COUNT(*) AS bookings
     FROM bookings b
     JOIN rooms r ON b.room_id = r.room_id
     WHERE b.status <> 'cancelled'
       AND b.check_in_date >= ? AND b.check_in_date < ?
     GROUP BY r.room_type
     ORDER BY revenue DESC`,
    [`${year}-01-01`, `${year + 1}-01-01`]
  );
  return rows;
}

module.exports = {
  getSummary,
  getRevenueYears,
  getMonthlyRevenue,
  getRevenueByRoomType
};
