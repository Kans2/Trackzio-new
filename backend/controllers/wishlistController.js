const Wishlist = require('../models/Wishlist');

/**
 * @desc   Get all wishlist items
 * @route  GET /api/wishlist
 */
const getAll = async (req, res, next) => {
  try {
    const items = await Wishlist.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Add a movie to wishlist
 * @route  POST /api/wishlist
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { movieId, title, posterPath, backdropPath, voteAverage, releaseDate, overview, genres } =
      req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: 'movieId and title are required',
      });
    }

    // Upsert — if already exists, don't throw
    const existing = await Wishlist.findOne({ movieId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Movie already in wishlist',
        data: existing,
      });
    }

    const item = await Wishlist.create({
      movieId,
      title,
      posterPath: posterPath || null,
      backdropPath: backdropPath || null,
      voteAverage: voteAverage || 0,
      releaseDate: releaseDate || '',
      overview: overview || '',
      genres: genres || [],
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const existing = await Wishlist.findOne({ movieId: req.body.movieId });
      return res.status(200).json({
        success: true,
        message: 'Movie already in wishlist',
        data: existing,
      });
    }
    next(error);
  }
};

/**
 * @desc   Remove movie from wishlist
 * @route  DELETE /api/wishlist/:movieId
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie ID',
      });
    }

    const deleted = await Wishlist.findOneAndDelete({ movieId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in wishlist',
      });
    }

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Check if a movie is in the wishlist
 * @route  GET /api/wishlist/check/:movieId
 */
const checkWishlist = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie ID',
      });
    }

    const exists = await Wishlist.exists({ movieId });
    res.json({ success: true, data: { isWishlisted: !!exists } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Batch check wishlist status for multiple movies
 * @route  GET /api/wishlist/check?ids=1,2,3
 */
const batchCheckWishlist = async (req, res, next) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'ids query parameter is required',
      });
    }

    const movieIds = ids
      .split(',')
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    const wishlisted = await Wishlist.find({ movieId: { $in: movieIds } }).select('movieId');
    const wishlistedIds = new Set(wishlisted.map((w) => w.movieId));

    const result = {};
    movieIds.forEach((id) => {
      result[id] = wishlistedIds.has(id);
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  batchCheckWishlist,
};
