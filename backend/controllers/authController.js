// controllers/authController.js :  admin login, first-admin setup, add admin, profile photo
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const { removePhotoFile } = require('../middleware/uploadMiddleware');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 5;

// Secure way for admin api access
function signToken(admin_id) {
  return jwt.sign({ admin_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// GET /api/auth/status  (public)
// Lets the login page know whether to show "create the first admin" instead of "log in".
async function getStatus(req, res) {
  try {
    const total = await adminModel.count();
    res.status(200).json({ hasAdmins: total > 0 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check admin accounts', error: err.message });
  }
}

// POST /api/auth/signup
// First admin: open to anyone, and logs them straight in. Admin must create other admins afterwards
async function signup(req, res) {
  try {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: 'email is not a valid email address' });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ message: `password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newId = await adminModel.createAdmin({ name, email, password_hash });
    const admin = await adminModel.getAdminById(newId);

    if (req.isFirstAdmin) {
      return res.status(201).json({ token: signToken(newId), admin });
    }
    res.status(201).json({ message: 'Admin created', admin });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'An admin with that email already exists' });
    }
    res.status(500).json({ message: 'Failed to create admin', error: err.message });
  }
}

// POST /api/auth/login  (public)
async function login(req, res) {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const record = await adminModel.getAdminByEmailWithPassword(email);
    // Same message whether the email or the password is wrong, so the login form
    // does not reveal which emails have accounts.
    if (!record || !(await bcrypt.compare(password, record.password_hash))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    const admin = await adminModel.getAdminById(record.admin_id);
    res.status(200).json({ token: signToken(record.admin_id), admin });
  } catch (err) {
    res.status(500).json({ message: 'Failed to log in', error: err.message });
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const admin = await adminModel.getAdminById(req.admin.admin_id);
    if (!admin) {
      return res.status(401).json({ message: 'This admin account no longer exists' });
    }
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin', error: err.message });
  }
}

// POST /api/auth/me/photo
async function uploadPhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Choose an image to upload' });
    }
    const current = await adminModel.getAdminById(req.admin.admin_id);
    const photo_url = `/uploads/admins/${req.file.filename}`;

    await adminModel.updatePhoto(req.admin.admin_id, photo_url);
    removePhotoFile(current && current.photo_url); // clean up the old photo

    const admin = await adminModel.getAdminById(req.admin.admin_id);
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload photo', error: err.message });
  }
}

// DELETE /api/auth/me/photo
async function removePhoto(req, res) {
  try {
    const current = await adminModel.getAdminById(req.admin.admin_id);
    await adminModel.updatePhoto(req.admin.admin_id, null);
    removePhotoFile(current && current.photo_url);

    const admin = await adminModel.getAdminById(req.admin.admin_id);
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove photo', error: err.message });
  }
}

module.exports = { getStatus, signup, login, me, uploadPhoto, removePhoto };
