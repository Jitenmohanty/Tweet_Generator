// models/TweetLog.js - Tweet logging schema
import mongoose from 'mongoose';

const tweetLogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxLength: 280
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  tweetId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'posted', 'failed'],
    default: 'pending'
  },
  error: {
    type: String,
    default: null
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  postedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
tweetLogSchema.index({ createdAt: -1 });
tweetLogSchema.index({ status: 1 });

export default mongoose.model('TweetLog', tweetLogSchema);
