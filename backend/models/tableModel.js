// models/tableModel.js
const db = require('../config/database');

async function getAllTables() {
  const [rows] = await db.query('SELECT * FROM restaurant_tables');
  return rows;
}

async function getTableById(id) {
  const [rows] = await db.query(
    'SELECT * FROM restaurant_tables WHERE table_id = ?',
    [id]
  );
  return rows[0];
}

async function createTable(data) {
  const { table_number, capacity, status } = data;
  const [result] = await db.query(
    'INSERT INTO restaurant_tables (table_number, capacity, status) VALUES (?, ?, ?)',
    [table_number, capacity, status || 'available']
  );
  return result.insertId;
}

async function updateTable(id, data) {
  const { table_number, capacity, status } = data;
  const [result] = await db.query(
    'UPDATE restaurant_tables SET table_number = ?, capacity = ?, status = ? WHERE table_id = ?',
    [table_number, capacity, status, id]
  );
  return result.affectedRows;
}

async function deleteTable(id) {
  const [result] = await db.query(
    'DELETE FROM restaurant_tables WHERE table_id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
};
