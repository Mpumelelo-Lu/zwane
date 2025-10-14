
import express from 'express';
import multer from 'multer';
import { uploadTillSlip } from '../controllers/tillSlipController.js';
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Server-side MIME type validation
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ 
        error: 'File too large.',
        message: 'File size must not exceed 5MB.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files.',
        message: 'Please upload only one file at a time.' 
      });
    }
  } else if (err) {
    return res.status(400).json({ 
      error: err.message,
      message: 'Invalid file upload.' 
    });
  }
  next();
};

// POST /api/tillslip/upload
router.post('/upload', upload.single('file'), handleMulterError, uploadTillSlip);

export default router;