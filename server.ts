import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import emailRouter from './src/api/send-email';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Correggo il percorso della cartella dist andando una cartella sopra
const rootDir = path.join(__dirname, '..');

const app = express();
const PORT = parseInt(process.env.VITE_PORT || '8080', 10);

console.log('Starting server with configuration:');
console.log('- PORT:', PORT);
console.log('- Root Directory:', rootDir);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(express.json());
app.use(express.static(path.join(rootDir, 'dist')));

// Log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', emailRouter);

app.get('/api/health', (req: Request, res: Response) => {
  console.log('Health check endpoint called');
  res.json({ status: 'ok' });
});

// Serve index.html for all routes
app.get('*', (req: Request, res: Response) => {
  console.log('Serving index.html for path:', req.path);
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
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