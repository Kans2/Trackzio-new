const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Order matters: specific routes before parameterized routes
router.get('/genres', movieController.getGenres);
router.get('/trending', movieController.getTrending);
router.get('/search', movieController.searchMovies);
router.get('/discover', movieController.discoverByGenre);
router.get('/top-rated', movieController.getTopRated);
router.get('/upcoming', movieController.getUpcoming);
router.get('/now-playing', movieController.getNowPlaying);
router.get('/:id', movieController.getMovieDetails);

module.exports = router;
