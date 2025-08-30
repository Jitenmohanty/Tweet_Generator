// routes/health.js - Health check and system status
import express from 'express';
import mongoose from 'mongoose';
import twitterService from '../services/twitterService.js';
import TweetLog from '../models/TweetLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        twitter: 'unknown',
        gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
      },
      stats: {
        totalTweets: 0,
        successfulTweets: 0,
        failedTweets: 0,
        lastTweet: null
      }
    };

    // Check Twitter API
    try {
      const isValid = await twitterService.validateCredentials();
      health.services.twitter = isValid ? 'connected' : 'invalid credentials';
    } catch (error) {
      health.services.twitter = 'error';
    }

    // Get tweet stats
    try {
      const stats = await TweetLog.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      health.stats.totalTweets = await TweetLog.countDocuments();
      health.stats.successfulTweets = stats.find(s => s._id === 'posted')?.count || 0;
      health.stats.failedTweets = stats.find(s => s._id === 'failed')?.count || 0;
      
      const lastTweet = await TweetLog.findOne({ status: 'posted' })
        .sort({ postedAt: -1 })
        .select('content postedAt');
      
      health.stats.lastTweet = lastTweet;
    } catch (error) {
      logger.error('Error fetching stats:', error);
    }

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router