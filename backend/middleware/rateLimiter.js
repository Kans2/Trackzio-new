const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for API endpoints.
 * Prevents abuse and excessive requests.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

/**
 * Stricter limiter for search endpoint
 */
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // max 30 searches per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many search requests, please slow down.',
  },
});

module.exports = { apiLimiter, searchLimiter };
