// jobs/tweetJob.js - Tweet generation and posting logic
import geminiService from '../services/geminiService.js';
import twitterService from '../services/twitterService.js';
import TweetLog from '../models/TweetLog.js';
import { logger } from '../utils/logger.js';

const topics = [
  'artificial intelligence',
  'machine learning',
  'web development',
  'cybersecurity',
  'blockchain',
  'cloud computing',
  'mobile development',
  'data science',
  'software engineering',
  'tech startups'
];

export async function generateAndPostTweet(customTopic = null) {
  try {
    logger.info('🤖 Starting tweet generation process...');
    
    // Select topic
    const topic = customTopic || topics[Math.floor(Math.random() * topics.length)];
    logger.info(`📝 Selected topic: ${topic}`);
    
    // Generate content
    const content = await geminiService.generateTweet(topic);
    const hashtags = await geminiService.generateHashtags(content, topic);
    
    // Create tweet log entry
    const tweetLog = new TweetLog({
      content,
      hashtags,
      status: 'pending'
    });
    
    try {
      // Post to Twitter
      const result = await twitterService.postTweet(content, hashtags);
      
      // Update log with success
      tweetLog.tweetId = result.tweetId;
      tweetLog.status = 'posted';
      tweetLog.postedAt = new Date();
      
      await tweetLog.save();
      
      logger.info(`✅ Tweet posted successfully! ID: ${result.tweetId}`);
      return { success: true, tweetLog };
      
    } catch (postError) {
      // Update log with error
      tweetLog.status = 'failed';
      tweetLog.error = postError.message;
      await tweetLog.save();
      
      throw postError;
    }
    
  } catch (error) {
    logger.error('❌ Tweet job failed:', error);
    
    // Don't throw in scheduled context to avoid crashing
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: error.message };
    }
    
    throw error;
  }
}