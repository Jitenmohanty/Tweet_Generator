// services/twitterService.js - Twitter API integration
import { TwitterApi } from 'twitter-api-v2';
import { logger } from '../utils/logger.js';

class TwitterService {
  constructor() {
    const requiredKeys = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET',
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_SECRET'
    ];
    
    for (const key of requiredKeys) {
      if (!process.env[key]) {
        throw new Error(`${key} is required`);
      }
    }
    
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    
    this.rwClient = this.client.readWrite;
  }

  async postTweet(content, hashtags = []) {
    try {
      // Combine content with hashtags
      const hashtagString = hashtags.join(' ');
      const fullTweet = `${content}\n\n${hashtagString}`.trim();
      
      // Final length check
      if (fullTweet.length > 280) {
        throw new Error(`Tweet too long: ${fullTweet.length} characters`);
      }
      
      const tweet = await this.rwClient.v2.tweet(fullTweet);
      
      logger.info(`✅ Tweet posted successfully: ${tweet.data.id}`);
      return {
        success: true,
        tweetId: tweet.data.id,
        content: fullTweet
      };
      
    } catch (error) {
      logger.error('❌ Error posting tweet:', error);
      
      // Handle specific Twitter API errors
      if (error.code === 187) {
        throw new Error('Duplicate tweet detected');
      }
      
      throw new Error(`Twitter API error: ${error.message}`);
    }
  }

  async getTweetMetrics(tweetId) {
    try {
      const tweet = await this.client.v2.singleTweet(tweetId, {
        'tweet.fields': ['public_metrics', 'created_at']
      });
      
      return tweet.data.public_metrics;
    } catch (error) {
      logger.error('Error fetching tweet metrics:', error);
      return null;
    }
  }

  async validateCredentials() {
    try {
      const user = await this.rwClient.v2.me();
      logger.info(`Twitter credentials valid for user: ${user.data.username}`);
      return true;
    } catch (error) {
      logger.error('Twitter credentials validation failed:', error);
      return false;
    }
  }
}

export default new TwitterService();
