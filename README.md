# 🤖 AI Twitter Agent

An intelligent Twitter bot that automatically generates and posts engaging tweets using Google's Gemini AI.

## Features

- 🤖 **AI-Powered Content**: Uses Gemini API to generate engaging tweets
- 📱 **Auto Posting**: Automatically posts to Twitter via Twitter API v2
- 🏷️ **Smart Hashtags**: AI-generated relevant hashtags for better reach
- ⏰ **Scheduled Posting**: Configurable cron jobs for automatic posting
- 📊 **Analytics**: Track tweet performance and engagement metrics
- 🗄️ **Data Persistence**: MongoDB for tweet history and logs
- 🔧 **REST API**: Manual controls and monitoring endpoints
- 🐳 **Docker Support**: Easy deployment with Docker

## Quick Start

### 1. Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Twitter Developer Account
- Google Cloud Account (for Gemini API)

### 2. Setup API Keys

#### Twitter API Setup:
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Generate API keys and access tokens
4. Ensure your app has "Read and Write" permissions

#### Gemini API Setup:
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create API key for Gemini
3. Note: Free tier includes generous daily limits

### 3. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-twitter-agent

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 4. Configure Environment

Edit `.env` file with your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here
MONGODB_URI=mongodb://localhost:27017/twitter-agent
PORT=3000
NODE_ENV=development
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns system status, database connection, and tweet statistics.

### Manual Tweet Generation
```
POST /api/tweets/generate
Content-Type: application/json

{
  "topic": "artificial intelligence" // optional
}
```

### Tweet History
```
GET /api/tweets/history?page=1&limit=20&status=posted
```

### Tweet Metrics
```
GET /api/tweets/:tweetId/metrics
```

## Deployment Options

### Option 1: Render (Free Tier)
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy - cron jobs work automatically

### Option 2: Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click

### Option 3: Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t ai-twitter-agent .
docker run -p 3000:3000 --env-file .env ai-twitter-agent
```

### Option 4: AWS Lambda (Serverless)
- Use AWS EventBridge for scheduling
- Deploy with Serverless Framework
- Cost-effective for infrequent posting

## Configuration

### Posting Schedule
Edit `jobs/scheduler.js` to customize posting times:

```javascript
// Daily at 10 AM UTC
cron.schedule('0 10 * * *', async () => {
  await generateAndPostTweet();
});

// Multiple daily posts
cron.schedule('0 14 * * *', async () => {
  await generateAndPostTweet('science');
});
```

### Content Topics
Modify topics array in `jobs/tweetJob.js`:

```javascript
const topics = [
  'your custom topic',
  'another topic',
  // ... more topics
];
```

### Tweet Templates
Customize prompts in `services/geminiService.js` for different content styles.

## Monitoring & Logs

- **Console Logs**: Real-time logging with Winston
- **File Logs**: `logs/combined.log` and `logs/error.log`
- **Database Logs**: All tweets stored with status and metrics
- **Health Endpoint**: `/api/health` for system monitoring

## Rate Limits & Best Practices

### Twitter API Free Tier Limits:
- 1,500 tweets per month (~50 per day)
- 300 requests per 15-minute window

### Gemini API Free Tier:
- 15 requests per minute
- 1,500 requests per day

### Best Practices:
- Monitor rate limits to avoid API suspensions
- Use diverse content topics to avoid repetitive tweets
- Check for duplicate content before posting
- Implement exponential backoff for API errors

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Verify all Twitter API keys are correct
   - Ensure app has Read/Write permissions
   - Check if access tokens are valid

2. **"Tweet too long"**
   - Content + hashtags exceed 280 characters
   - Adjust content generation prompts

3. **"Duplicate tweet"**
   - Twitter rejects identical content
   - Implement content variation logic

4. **"Rate limit exceeded"**
   - Reduce posting frequency
   - Implement proper rate limiting

5. **Database connection issues**
   - Check MongoDB URI
   - Ensure MongoDB is running

## Advanced Features

### Content Strategies
The bot includes multiple content strategies:

- **Educational**: Tech facts and tutorials
- **Motivational**: Inspiring tech quotes
- **News-style**: Latest in tech trends
- **Question-based**: Engaging questions for followers

### Hashtag Optimization
- AI-generated hashtags based on content
- Trending hashtag detection
- Industry-specific tag selection

### Analytics Integration
- Track engagement metrics
- Monitor posting performance
- Identify best performing content types

## Security Considerations

- Store API keys in environment variables only
- Use rate limiting to prevent abuse
- Implement proper error handling
- Monitor for suspicious activity
- Regular credential rotation

## Scaling Up

### Production Enhancements:
1. **Content Database**: Store high-performing tweet templates
2. **A/B Testing**: Test different content styles
3. **Engagement Analysis**: Respond to mentions and comments
4. **Multi-Account Support**: Manage multiple Twitter accounts
5. **Content Calendar**: Plan themed content for events
6. **Image Generation**: Add AI-generated images to tweets
7. **Trend Analysis**: Generate content based on trending topics

### Infrastructure Scaling:
- Redis for caching and rate limiting
- PostgreSQL for complex analytics
- Message queues for reliable job processing
- Load balancers for high availability
- Monitoring with Prometheus/Grafana

## Legal & Compliance

- Follow Twitter's Terms of Service
- Respect rate limits and usage policies
- Ensure content complies with platform rules
- Consider disclosure that account is bot-operated
- Monitor for policy changes

## Cost Estimation

### Free Tier (Monthly):
- Gemini API: $0 (within free limits)
- Twitter API: $0 (free tier)
- Render/Railway: $0 (with limitations)
- MongoDB Atlas: $0 (free tier 512MB)

**Total**: $0/month for basic usage

### Paid Tier (Monthly):
- Gemini API: ~$5-20 (depending on usage)
- Twitter API: $100+ (for higher tiers)
- Cloud hosting: $10-50
- Database: $10-30

**Total**: $125-200/month for production scale

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section
- Review logs in `/logs` directory
- Open GitHub issues for bugs
- Use health endpoint for system diagnostics

---

## File Structure

```
ai-twitter-agent/
├── index.js                 # Main application entry
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (create from template)
├── .gitignore             # Git ignore rules
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Local development setup
├── README.md              # This file
├── config/
│   └── database.js        # Database connection
├── models/
│   └── TweetLog.js        # Tweet schema
├── services/
│   ├── geminiService.js   # AI content generation
│   └── twitterService.js  # Twitter API integration
├── jobs/
│   ├── scheduler.js       # Cron job setup
│   └── tweetJob.js        # Tweet generation logic
├── routes/
│   ├── tweets.js          # Tweet API endpoints
│   └── health.js          # Health check endpoints
├── utils/
│   ├── logger.js          # Logging configuration
│   └── rateLimiter.js     # Rate limiting utilities
├── logs/                  # Log files (auto-created)
└── test.js               # Testing script
```

Ready to deploy! 🚀