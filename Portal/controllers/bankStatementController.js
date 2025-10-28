const path = require('path');

// Configuration
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

// Validation helper functions
const validateFileType = (mimeType, originalName) => {
  const fileExtension = path.extname(originalName).toLowerCase();
  
  const isValidMime = ALLOWED_MIME_TYPES.includes(mimeType);
  const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);
  
  return isValidMime && isValidExtension;
};

const validateFileSize = (fileSize) => {
  return fileSize <= MAX_FILE_SIZE;
};

const sanitizeFilename = (originalName) => {
  // Remove any potentially dangerous characters
  return originalName
    .replace(/[^a-zA-Z0-9.-]/g, '')
    .substring(0, 255); // Limit filename length
};

exports.uploadBankStatement = async (req, res) => {
  try {
    console.log('📥 Bank statement upload endpoint hit');

    // Check if file exists
    if (!req.file) {
      console.log('⚠ No file received in request');
      return res.status(400).json({ 
        error: 'No file uploaded.',
        message: 'Please select a file and try again.' 
      });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // Validate file type
    if (!validateFileType(mimetype, originalname)) {
      console.log('⚠ Invalid file type:', mimetype, originalname);
      return res.status(400).json({ 
        error: 'Invalid file type.',
        message: 'Only JPG, PNG, and PDF files are allowed.' 
      });
    }

    // Validate file size
    if (!validateFileSize(size)) {
      console.log('⚠ File size exceeds limit:', size);
      return res.status(400).json({ 
        error: 'File too large.',
        message: `File size must not exceed 5MB. Your file is ${(size / 1024 / 1024).toFixed(2)}MB.` 
      });
    }

    // Sanitize filename
    const sanitizedFilename = sanitizeFilename(originalname);
  console.log('🏦 File validated:', sanitizedFilename, `(${(size / 1024).toFixed(2)}KB)`);

    // TODO: Upload to Supabase here
    // const { data, error } = await supabase.storage
    //   .from('bank-statement')
    //   .upload(${Date.now()}_${sanitizedFilename}, buffer, {
    //     contentType: mimetype,
    //   });

    res.status(200).json({
      message: 'Bank statement uploaded successfully!',
      filename: sanitizedFilename,
      size: size,
      sizeFormatted: `${(size / 1024).toFixed(2)}KB`,
      mimeType: mimetype,
      // url: data.path, // Will add this after Supabase integration
      uploadedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during file upload. Please try again.' 
    });
  }
};