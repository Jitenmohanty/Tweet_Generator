// index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { initializeScheduler } from './jobs/scheduler.js';
import { logger } from './utils/logger.js';
import tweetRoutes from './routes/tweets.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tweets', tweetRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Twitter Agent is running! 🤖🐦',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
export default app;

// Only run server locally
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    try {
      await connectDB();
      initializeScheduler();
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        logger.info(`🚀 AI Twitter Agent running on port ${PORT}`);
      });
    } catch (err) {
      logger.error('Failed to start server:', err);
      process.exit(1);
    }
  })();
}
