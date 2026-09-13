// models/customerModel.js
const db = require('../config/database');

async function getAllCustomers() {
  const [rows] = await db.query('SELECT * FROM customers');
  return rows;
}

async function getCustomerById(id) {
  const [rows] = await db.query(
    'SELECT * FROM customers WHERE customer_id = ?',
    [id]
  );
  return rows[0];
}

async function createCustomer(data) {
  const { name, phone, email } = data;
  const [result] = await db.query(
    'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)',
    [name, phone, email]
  );
  return result.insertId;
}

async function updateCustomer(id, data) {
  const { name, phone, email } = data;
  const [result] = await db.query(
    'UPDATE customers SET name = ?, phone = ?, email = ? WHERE customer_id = ?',
    [name, phone, email, id]
  );
  return result.affectedRows;
}

async function deleteCustomer(id) {
  const [result] = await db.query(
    'DELETE FROM customers WHERE customer_id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
