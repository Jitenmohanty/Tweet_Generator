// utils/rateLimiter.js - Rate limiting for API calls
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  canMakeRequest(key = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key);
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    return validRequests.length < this.maxRequests;
  }

  addRequest(key = 'default') {
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    this.requests.get(key).push(Date.now());
  }
}

export const twitterRateLimit = new RateLimiter(50, 24 * 60 * 60 * 1000); // 50 tweets per day
export const geminiRateLimit = new RateLimiter(60, 60 * 1000); // 60 requests per minute

// test.js - Test