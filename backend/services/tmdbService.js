const config = require('../config');
const cache = require('./cacheService');
const {
  transformPaginatedResponse,
  transformMovieDetails,
  transformGenres,
} = require('../utils/transformers');

const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,      // 5 min — trending, search results
  MEDIUM: 30 * 60 * 1000,    // 30 min — movie details
  LONG: 24 * 60 * 60 * 1000, // 24 hrs — genres list
};

// Genre map for resolving genre IDs to names (populated on first call)
let genreMap = {};

/**
 * Make a request to TMDB API with retry logic
 */
const tmdbFetch = async (endpoint, params = {}, retries = 3) => {
  const url = new URL(`${config.tmdb.baseUrl}${endpoint}`);
  
  // Determine auth method: Bearer token vs api_key
  const accessToken = config.tmdb.accessToken;
  const apiKey = config.tmdb.apiKey;
  
  // Prefer Access Token, fallback to API key
  const useBearerToken = accessToken && accessToken.length > 0;

  // If using api_key method, add as query param
  if (!useBearerToken && apiKey) {
    url.searchParams.set('api_key', apiKey);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  // Build headers
  const headers = {
    Accept: 'application/json',
  };
  if (useBearerToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url.toString(), { headers });

      if (response.status === 429) {
        // Rate limited — wait and retry
        const retryAfter = parseInt(response.headers.get('Retry-After') || '2', 10);
        console.warn(`TMDB rate limited. Retrying in ${retryAfter}s...`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const error = new Error(
          errorBody.status_message || `TMDB API error: ${response.status}`
        );
        error.statusCode = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 500;
      console.warn(`TMDB fetch attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Ensure genre map is populated
 */
const ensureGenreMap = async () => {
  if (Object.keys(genreMap).length === 0) {
    const data = await tmdbFetch('/genre/movie/list');
    genreMap = {};
    (data.genres || []).forEach((g) => {
      genreMap[g.id] = g.name;
    });
  }
  return genreMap;
};

/**
 * Get trending movies
 */
const getTrending = async (page = 1, timeWindow = 'week') => {
  const cacheKey = `trending:${timeWindow}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  await ensureGenreMap();
  const data = await tmdbFetch(`/trending/movie/${timeWindow}`, { page });
  const result = transformPaginatedResponse(data, genreMap);

  cache.set(cacheKey, result, CACHE_TTL.SHORT);
  return result;
};

/**
 * Search movies by query
 */
const searchMovies = async (query, page = 1) => {
  if (!query || query.trim().length === 0) {
    return { page: 1, totalPages: 0, totalResults: 0, results: [] };
  }

  const cacheKey = `search:${query.toLowerCase().trim()}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  await ensureGenreMap();
  const data = await tmdbFetch('/search/movie', {
    query: query.trim(),
    page,
    include_adult: false,
  });
  const result = transformPaginatedResponse(data, genreMap);

  cache.set(cacheKey, result, CACHE_TTL.SHORT);
  return result;
};

/**
 * Get full movie details with credits, videos, and similar movies
 */
const getMovieDetails = async (movieId) => {
  const cacheKey = `movie:${movieId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await tmdbFetch(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar',
  });
  const result = transformMovieDetails(data);

  cache.set(cacheKey, result, CACHE_TTL.MEDIUM);
  return result;
};

/**
 * Get list of genres
 */
const getGenres = async () => {
  const cacheKey = 'genres';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await tmdbFetch('/genre/movie/list');
  const result = transformGenres(data);

  // Also update genre map
  genreMap = {};
  result.forEach((g) => {
    genreMap[g.id] = g.name;
  });

  cache.set(cacheKey, result, CACHE_TTL.LONG);
  return result;
};

/**
 * Discover movies by genre with sorting
 */
const discoverByGenre = async (genreId, page = 1, sortBy = 'popularity.desc') => {
  const cacheKey = `discover:${genreId}:${sortBy}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  await ensureGenreMap();
  const data = await tmdbFetch('/discover/movie', {
    with_genres: genreId,
    sort_by: sortBy,
    page,
    include_adult: false,
    'vote_count.gte': 50,
  });
  const result = transformPaginatedResponse(data, genreMap);

  cache.set(cacheKey, result, CACHE_TTL.SHORT);
  return result;
};

/**
 * Get top rated movies
 */
const getTopRated = async (page = 1) => {
  const cacheKey = `top-rated:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  await ensureGenreMap();
  const data = await tmdbFetch('/movie/top_rated', { page });
  const result = transformPaginatedResponse(data, genreMap);

  cache.set(cacheKey, result, CACHE_TTL.SHORT);
  return result;
};

/**
 * Get upcoming movies
 */
const getUpcoming = async (page = 1) => {
  const cacheKey = `upcoming:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  await ensureGenreMap();
  const data = await tmdbFetch('/movie/upcoming', { page });
  const result = transformPaginatedResponse(data, genreMap);

  cache.set(cacheKey, result, CACHE_TTL.SHORT);
  return result;
};

/**
 * Get now playing movies
 */
const getNowPlaying = async (page = 1) => {
  const cacheKey = `now-playing:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  await ensureGenreMap();
  const data = await tmdbFetch('/movie/now_playing', { page });
  const result = transformPaginatedResponse(data, genreMap);

  cache.set(cacheKey, result, CACHE_TTL.SHORT);
  return result;
};

module.exports = {
  getTrending,
  searchMovies,
  getMovieDetails,
  getGenres,
  discoverByGenre,
  getTopRated,
  getUpcoming,
  getNowPlaying,
};
