// middleware/uploadMiddleware.js: saves admin profile photos to uploads/admins using multer
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'admins');
const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
};
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // create the folder the first time
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    // e.g. admin-3-1789544678478.png  (timestamp keeps browsers from showing an old cached photo)
    cb(null, `admin-${req.admin.admin_id}-${Date.now()}${ALLOWED_TYPES[file.mimetype]}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter(req, file, cb) {
    if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
    const typeError = new Error('Unsupported file type');
    typeError.code = 'INVALID_FILE_TYPE';
    cb(typeError);
  }
});

// Wraps multer so its errors come back as the same JSON shape as the rest of the API.
function uploadPhoto(req, res, next) {
  upload.single('photo')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Photo must be 2 MB or smaller' });
    }
    if (err.code === 'INVALID_FILE_TYPE') {
      return res.status(400).json({ message: 'Photo must be a JPG, PNG, WEBP or GIF image' });
    }
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Send the image in a form field named "photo"' });
    }
    next(err);
  });
}

// Deletes a previously uploaded photo file, given its public URL (/uploads/admins/...).
function removePhotoFile(photoUrl) {
  if (!photoUrl || !photoUrl.startsWith('/uploads/admins/')) return;
  const filePath = path.join(UPLOAD_DIR, path.basename(photoUrl));
  fs.unlink(filePath, () => {}); // ignore "file already gone"
}

module.exports = { uploadPhoto, removePhotoFile };
