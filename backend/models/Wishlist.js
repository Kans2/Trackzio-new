const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    movieId: {
      type: Number,
      required: [true, 'Movie ID is required'],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Movie title is required'],
    },
    posterPath: {
      type: String,
      default: null,
    },
    backdropPath: {
      type: String,
      default: null,
    },
    voteAverage: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: String,
      default: '',
    },
    overview: {
      type: String,
      default: '',
    },
    genres: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
