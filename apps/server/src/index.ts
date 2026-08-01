import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import healthRouter from './routes/health';

// Load environment variables from repository root or local directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);

// Root route welcome endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'BestT Backend API',
    status: 'running',
    healthCheck: '/health',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 BestT Express Server running at http://localhost:${PORT}`);
  console.log(`   Health Check Endpoint: http://localhost:${PORT}/health`);
});
