import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// NEW: Import security and logging packages
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js'; 
import comments from './models/Comment.js';

// --- ESM Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END ESM Setup ---

dotenv.config();
connectDB();

const app = express();

// NEW: Security Headers
// We use 'cross-origin' policy so your frontend can load images from this backend
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// NEW: Logging
// 'dev' gives concise color-coded logs. 'combined' is better for true production logs.
app.use(morgan('dev'));

app.use(cors()); // Use CORS for all requests

// Serve static files from 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Apply middleware per-route ---

// 💡 /api/posts uses Formidable, so it does NOT get express.json()
// It must come BEFORE the JSON routes that use the same base path
app.use('/api/posts', postRoutes); 

// These routes DO need to parse JSON
app.use('/api/categories', express.json(), categoryRoutes);
app.use('/api/auth', express.json(), authRoutes);

// Simple message to confirm the API is running
app.get('/', (req, res) => {
    res.send('MERN Blog API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});