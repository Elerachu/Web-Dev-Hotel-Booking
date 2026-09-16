// models/adminModel.js: database queries for the admins table (login accounts)
const db = require('../config/database');

// Columns that are safe to send to the frontend (never the password hash)
const PUBLIC_COLUMNS = 'admin_id, name, email, photo_url, created_at';

async function count() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM admins');
  return Number(rows[0].total);
}

// Includes password_hash; only used by login to compare passwords
async function getAdminByEmailWithPassword(email) {
  const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
  return rows[0];
}

async function getAdminById(id) {
  const [rows] = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM admins WHERE admin_id = ?`, [id]);
  return rows[0];
}

async function createAdmin({ name, email, password_hash }) {
  const [result] = await db.query(
    'INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, password_hash]
  );
  return result.insertId;
}

async function updatePhoto(id, photo_url) {
  const [result] = await db.query('UPDATE admins SET photo_url = ? WHERE admin_id = ?', [
    photo_url,
    id
  ]);
  return result.affectedRows;
}

module.exports = {
  count,
  getAdminByEmailWithPassword,
  getAdminById,
  createAdmin,
  updatePhoto
};
