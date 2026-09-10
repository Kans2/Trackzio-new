const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.get('/', wishlistController.getAll);
router.post('/', wishlistController.addToWishlist);
router.delete('/:movieId', wishlistController.removeFromWishlist);
router.get('/check/:movieId', wishlistController.checkWishlist);
router.get('/batch-check', wishlistController.batchCheckWishlist);

module.exports = router;
