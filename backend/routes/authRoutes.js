// routes/authRoutes.js: contains endpoints for admin login, adding admins and profile photos
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireAuthOnceAdminsExist } = require('../middleware/authMiddleware');
const { uploadPhoto } = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         admin_id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         photo_url:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Check whether any admin account exists yet
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: "{ hasAdmins: boolean } - false only before the first admin is created"
 */
router.get('/status', authController.getStatus);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create an admin. Open for the first admin only; after that a Bearer token is required.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Admin created (the first admin also receives a token)
 *       400:
 *         description: Missing/invalid fields or duplicate email
 *       401:
 *         description: Admins already exist and no valid token was sent
 */
router.post('/signup', requireAuthOnceAdminsExist, authController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in and receive a token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "{ token, admin } - paste the token into Swagger's Authorize button"
 *       401:
 *         description: Email or password is incorrect
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the logged-in admin
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The logged-in admin
 *       401:
 *         description: Missing or expired token
 */
router.get('/me', requireAuth, authController.me);

/**
 * @swagger
 * /api/auth/me/photo:
 *   post:
 *     summary: Upload a profile photo for the logged-in admin (max 2 MB)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The admin with the new photo_url
 *       400:
 *         description: No file, wrong file type, or file too large
 *   delete:
 *     summary: Remove the logged-in admin's photo (initials are shown instead)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The admin with photo_url set to null
 */
router.post('/me/photo', requireAuth, uploadPhoto, authController.uploadPhoto);
router.delete('/me/photo', requireAuth, authController.removePhoto);

module.exports = router;
