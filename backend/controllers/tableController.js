// controllers/tableController.js
const tableModel = require('../models/tableModel');

// The schema's status column is an ENUM with only these three allowed
// values. We check against this same list here in the controller so
// the client gets a clear 400 message instead of a confusing MySQL
// error if someone sends e.g. "Available" (wrong case) or "closed".
const VALID_STATUSES = ['available', 'occupied', 'reserved'];

async function getAllTables(req, res) {
  try {
    const tables = await tableModel.getAllTables();
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tables', error: err.message });
  }
}

async function getTableById(req, res) {
  try {
    const table = await tableModel.getTableById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch table', error: err.message });
  }
}

async function createTable(req, res) {
  try {
    const { table_number, capacity, status } = req.body;

    if (!table_number || !capacity) {
      return res.status(400).json({ message: 'table_number and capacity are required' });
    }
    if (capacity <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than 0' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const newId = await tableModel.createTable(req.body);
    res.status(201).json({ message: 'Table created', table_id: newId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A table with that table_number already exists' });
    }
    res.status(500).json({ message: 'Failed to create table', error: err.message });
  }
}

async function updateTable(req, res) {
  try {
    const { status } = req.body;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const affectedRows = await tableModel.updateTable(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({ message: 'Table updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A table with that table_number already exists' });
    }
    res.status(500).json({ message: 'Failed to update table', error: err.message });
  }
}

async function deleteTable(req, res) {
  try {
    const affectedRows = await tableModel.deleteTable(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({ message: 'Table deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete table', error: err.message });
  }
}

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
};
