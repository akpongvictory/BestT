import express from 'express';
import cors from 'cors';
import { env } from "./config/env";
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import courseRouter from "./routes/courses";
import documentRouter from "./routes/documents";
import chatRouter from "./routes/chat";
import quizRouter from "./routes/quiz";
// Load environment variables

const PORT = env.port;


const app = express();

// Middleware
app.use(
  cors({
      origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://best-t-client-ms3n-jade.vercel.app",
    ],
        credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/documents', documentRouter);
app.use('/api/quiz', quizRouter);

// Debugging middleware to log incoming requests
app.use((req, _res, next) => {
  console.log(
    `[REQUEST] ${req.method} ${req.originalUrl}`
  );
  next();
});
app.use("/api/chat", chatRouter);
// Root endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'BestT Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      root: '/',
      health: '/health',
      auth: '/api/auth',
      courses: '/api/courses',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Server Error:', err);

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log('=======================================');
  console.log('🚀 BestT Backend API Started');
  console.log(`📍 Server:  http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth:    http://localhost:${PORT}/api/auth`);
  console.log('=======================================');
});