"use strict";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import emailRouter from './api/send-email.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.VITE_PORT || 8080;

console.log('Starting server with configuration:');
console.log('- PORT:', PORT);
console.log('- __dirname:', __dirname);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api', emailRouter);

app.get('/api/health', (req, res) => {
    console.log('Health check endpoint called');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    console.log('Serving index.html for path:', req.path);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Local URL: http://localhost:${PORT}`);
    console.log(`Network URL: http://0.0.0.0:${PORT}`);
    console.log('=================================');
});
