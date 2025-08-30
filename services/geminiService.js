// services/geminiService.js - AI content generation
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import dotenv from  "dotenv";
dotenv.config();

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateTweet(topic = 'technology') {
    const prompts = [
      `Write an engaging tweet about ${topic}. Keep it under 240 characters to leave room for hashtags. Make it informative, thought-provoking, or inspiring. No hashtags in the main content.`,
      
      `Create a fascinating fact tweet about ${topic}. Under 240 characters. Should be surprising, educational, or mind-blowing. No hashtags in the content.`,
      
      `Write a motivational tweet related to ${topic}. Under 240 characters. Should inspire or encourage your audience. No hashtags in the main text.`,
      
      `Share an interesting observation about ${topic}. Under 240 characters. Make it relatable and engaging. No hashtags in the content.`
    ];

    try {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      const result = await this.model.generateContent(randomPrompt);
      const content = result.response.text().trim();
      
      // Clean up content
      let cleanContent = content
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/#\w+/g, '') // Remove any hashtags
        .trim();
      
      // Ensure content is within limits
      if (cleanContent.length > 240) {
        cleanContent = cleanContent.substring(0, 237) + '...';
      }
      
      logger.info(`Generated tweet content: ${cleanContent}`);
      return cleanContent;
      
    } catch (error) {
      logger.error('Error generating tweet:', error);
      throw new Error('Failed to generate tweet content');
    }
  }

  async generateHashtags(content, topic = 'technology') {
    try {
      const prompt = `Based on this tweet content: "${content}" and topic: "${topic}", suggest exactly 3 relevant, trending hashtags. Return only the hashtags separated by spaces, with # symbols. Focus on popular, searchable tags.`;
      
      const result = await this.model.generateContent(prompt);
      const hashtagText = result.response.text().trim();
      
      // Parse hashtags
      const hashtags = hashtagText
        .split(/\s+/)
        .filter(tag => tag.startsWith('#'))
        .slice(0, 3) // Limit to 3 hashtags
        .map(tag => tag.replace(/[^\w#]/g, '')); // Clean special chars
      
      // Fallback hashtags if generation fails
      if (hashtags.length === 0) {
        const fallbackTags = {
          technology: ['#Tech', '#Innovation', '#AI'],
          science: ['#Science', '#Research', '#Discovery'],
          business: ['#Business', '#Startup', '#Entrepreneur'],
          default: ['#Daily', '#Inspiration', '#Knowledge']
        };
        return fallbackTags[topic] || fallbackTags.default;
      }
      
      logger.info(`Generated hashtags: ${hashtags.join(' ')}`);
      return hashtags;
      
    } catch (error) {
      logger.error('Error generating hashtags:', error);
      return ['#Tech', '#AI', '#Innovation']; // Fallback
    }
  }
}

export default new GeminiService();