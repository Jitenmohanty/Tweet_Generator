// jobs/scheduler.js - Cron job management
import cron from 'node-cron';
import { generateAndPostTweet } from './tweetJob.js';
import { logger } from '../utils/logger.js';

export function initializeScheduler() {
  // Daily tweet at 10:00 AM
  cron.schedule('0 1 * * *', async () => {
    logger.info('🕙 Daily tweet job triggered');
    await generateAndPostTweet();
  }, {
    timezone: 'UTC'
  });

  // Optional: Multiple daily tweets
  // Uncomment for more frequent posting
  /*
  cron.schedule('0 14 * * *', async () => {
    logger.info('🕑 Afternoon tweet job triggered');
    await generateAndPostTweet('science');
  });

  cron.schedule('0 18 * * *', async () => {
    logger.info('🕕 Evening tweet job triggered');
    await generateAndPostTweet('business');
  });
  */

  logger.info('⏰ Scheduler initialized - daily tweets at 10:00 AM UTC');
}
