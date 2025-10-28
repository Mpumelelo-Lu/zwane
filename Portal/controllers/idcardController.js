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
	return originalName.replace(/[^a-zA-Z0-9.-]/g, '').substring(0, 255);
};

exports.uploadIdCard = async (req, res) => {
	try {
		console.log('🪪 ID card upload endpoint hit');
		if (!req.files || !req.files.filefront || !req.files.fileback) {
			console.log('⚠️ Both front and back files are required');
			return res.status(400).json({
				error: 'Both front and back files are required.',
				message: 'Please select both front and back images of your ID card.'
			});
		}

		const front = req.files.filefront[0];
		const back = req.files.fileback[0];

		// Validate file types
		if (!validateFileType(front.mimetype, front.originalname) || !validateFileType(back.mimetype, back.originalname)) {
			return res.status(400).json({
				error: 'Invalid file type.',
				message: 'Only JPG, PNG, and PDF files are allowed for both sides.'
			});
		}

		// Validate file sizes
		if (!validateFileSize(front.size) || !validateFileSize(back.size)) {
			return res.status(400).json({
				error: 'File too large.',
				message: 'Each file must not exceed 5MB.'
			});
		}

		// Sanitize filenames
		const sanitizedFront = sanitizeFilename(front.originalname);
		const sanitizedBack = sanitizeFilename(back.originalname);

		// Here you would save the files to disk or cloud storage
		// For now, just respond with success and filenames
		res.json({
			message: 'ID card uploaded successfully!',
			filenames: {
				front: sanitizedFront,
				back: sanitizedBack
			}
		});
	} catch (err) {
		console.error('❌ Error uploading ID card:', err);
		res.status(500).json({
			error: 'Server error.',
			message: 'An error occurred while uploading your ID card.'
		});
	}
};
