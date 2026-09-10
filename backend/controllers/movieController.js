const tmdbService = require('../services/tmdbService');

/**
 * @desc   Get trending movies
 * @route  GET /api/movies/trending
 */
const getTrending = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const timeWindow = req.query.time_window || 'week';
    const data = await tmdbService.getTrending(page, timeWindow);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Search movies by query
 * @route  GET /api/movies/search
 */
const searchMovies = async (req, res, next) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const data = await tmdbService.searchMovies(query, page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get movie details by ID
 * @route  GET /api/movies/:id
 */
const getMovieDetails = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);

    if (isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie ID',
      });
    }

    const data = await tmdbService.getMovieDetails(movieId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all genres
 * @route  GET /api/movies/genres
 */
const getGenres = async (req, res, next) => {
  try {
    const data = await tmdbService.getGenres();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Discover movies by genre
 * @route  GET /api/movies/discover
 */
const discoverByGenre = async (req, res, next) => {
  try {
    const { genre, sort_by } = req.query;
    const page = parseInt(req.query.page) || 1;

    const data = await tmdbService.discoverByGenre(genre, page, sort_by);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get top rated movies
 * @route  GET /api/movies/top-rated
 */
const getTopRated = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getTopRated(page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get upcoming movies
 * @route  GET /api/movies/upcoming
 */
const getUpcoming = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getUpcoming(page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get now playing movies
 * @route  GET /api/movies/now-playing
 */
const getNowPlaying = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getNowPlaying(page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
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
