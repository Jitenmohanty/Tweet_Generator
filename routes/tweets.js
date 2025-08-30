// routes/tweets.js - API routes for manual control
import express from 'express';
import { generateAndPostTweet } from '../jobs/tweetJob.js';
import TweetLog from '../models/TweetLog.js';
import twitterService from '../services/twitterService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Manual tweet generation
router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;
    const result = await generateAndPostTweet(topic);
    
    res.json({
      success: true,
      message: 'Tweet generated and posted!',
      data: result.tweetLog
    });
  } catch (error) {
    logger.error('Manual tweet generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get tweet history
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    
    const tweets = await TweetLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await TweetLog.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        tweets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching tweet history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get tweet metrics
router.get('/:tweetId/metrics', async (req, res) => {
  try {
    const { tweetId } = req.params;
    const metrics = await twitterService.getTweetMetrics(tweetId);
    
    if (metrics) {
      // Update stored metrics
      await TweetLog.findOneAndUpdate(
        { tweetId },
        { metrics },
        { new: true }
      );
    }
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Error fetching tweet metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete tweet
router.delete('/:tweetId', async (req, res) => {
  try {
    const { tweetId } = req.params;
    
    // Delete from Twitter (if possible with your API tier)
    // Note: Tweet deletion might require higher API tier
    // await twitterService.deleteTweet(tweetId);
    
    // Update log
    await TweetLog.findOneAndUpdate(
      { tweetId },
      { status: 'deleted' }
    );
    
    res.json({
      success: true,
      message: 'Tweet marked as deleted'
    });
  } catch (error) {
    logger.error('Error deleting tweet:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;