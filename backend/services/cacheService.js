/**
 * In-memory cache with TTL support.
 * Prevents redundant TMDB API calls for repeated requests.
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes

    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * Get a cached value by key
   * @param {string} key
   * @returns {*|null} cached value or null if expired/missing
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set a value in cache with optional TTL
   * @param {string} key
   * @param {*} value
   * @param {number} ttlMs - Time to live in milliseconds
   */
  set(key, value, ttlMs = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Delete a specific cache entry
   * @param {string} key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cached entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Remove all expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats
   */
  stats() {
    return {
      size: this.cache.size,
    };
  }

  /**
   * Destroy the cache service (clear interval)
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// Singleton instance
module.exports = new CacheService();
