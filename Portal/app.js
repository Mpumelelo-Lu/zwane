// Basic Express server for Portal

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import tillSlipRoute from './routes/tillSlipRoute.js';

const app = express();
const PORT = process.env.PORT || 5001;

// For ES modules __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/tillslip', tillSlipRoute);

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Portal app running at http://localhost:${PORT}`);
});
