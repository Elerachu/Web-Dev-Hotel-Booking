// middleware/authMiddleware.js: checks the login token on protected routes

const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

// Blocks the request unless a valid token is present.
// On success, req.admin = { admin_id } is available to the next handler.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'You need to log in to use this route' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { admin_id: payload.admin_id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Your session has expired. Log in again.' });
  }
}

// Used only by POST /api/auth/signup.
// While the admins table is empty, anyone may create the very first admin.
// After that, only a logged-in admin can add more admins.
async function requireAuthOnceAdminsExist(req, res, next) {
  try {
    const total = await adminModel.count();
    if (total === 0) {
      req.isFirstAdmin = true;
      return next();
    }
    return requireAuth(req, res, next);
  } catch (err) {
    console.error('requireAuthOnceAdminsExist error:', err);
    res.status(500).json({ message: 'Failed to check admin accounts' });
  }
}

module.exports = { requireAuth, requireAuthOnceAdminsExist };
