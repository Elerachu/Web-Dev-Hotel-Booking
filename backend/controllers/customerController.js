const customerModel = require('../models/customerModel');

async function getAllCustomers(req, res) {
  try {
    const customers = await customerModel.getAllCustomers();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
}

async function getCustomerById(req, res) {
  try {
    const customer = await customerModel.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customer', error: err.message });
  }
}

async function createCustomer(req, res) {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const newId = await customerModel.createCustomer(req.body);
    res.status(201).json({ message: 'Customer created', customer_id: newId });
  } catch (err) {
    // A duplicate email will fail here because of the UNIQUE constraint
    // on customers.email — mysql2 throws an error with code 'ER_DUP_ENTRY'.
    // Catching it specifically gives a much clearer message than a raw 500.
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A customer with that email already exists' });
    }
    res.status(500).json({ message: 'Failed to create customer', error: err.message });
  }
}

async function updateCustomer(req, res) {
  try {
    const affectedRows = await customerModel.updateCustomer(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A customer with that email already exists' });
    }
    res.status(500).json({ message: 'Failed to update customer', error: err.message });
  }
}

async function deleteCustomer(req, res) {
  try {
    const affectedRows = await customerModel.deleteCustomer(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // N/B: deleting a customer also deletes their reservations,
    // because of ON DELETE CASCADE in the schema.
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete customer', error: err.message });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
