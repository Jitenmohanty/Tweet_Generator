// test.js - Testing script
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { generateAndPostTweet } from './jobs/tweetJob.js';
import twitterService from './services/twitterService.js';
import geminiService from './services/geminiService.js';
import { logger } from './utils/logger.js';

dotenv.config();

async function runTests() {
  try {
    logger.info('🧪 Starting AI Twitter Agent tests...');
    
    // Test database connection
    logger.info('Testing database connection...');
    await connectDB();
    logger.info('✅ Database connected');
    
    // Test Twitter credentials
    logger.info('Testing Twitter credentials...');
    const isTwitterValid = await twitterService.validateCredentials();
    logger.info(`✅ Twitter: ${isTwitterValid ? 'Valid' : 'Invalid'}`);
    
    // Test Gemini content generation
    logger.info('Testing Gemini content generation...');
    const content = await geminiService.generateTweet('artificial intelligence');
    const hashtags = await geminiService.generateHashtags(content, 'artificial intelligence');
    logger.info(`✅ Generated content: ${content}`);
    logger.info(`✅ Generated hashtags: ${hashtags.join(' ')}`);
    
    // Test full tweet generation (uncomment to actually post)
    // logger.info('Testing full tweet generation...');
    // const result = await generateAndPostTweet('testing');
    // logger.info(`✅ Full test: ${result.success ? 'Success' : 'Failed'}`);
    
    logger.info('🎉 All tests completed successfully!');
    process.exit(0);
    
  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
