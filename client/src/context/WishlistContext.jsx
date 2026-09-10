import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWishlist, addToWishlist as apiAdd, removeFromWishlist as apiRemove } from '../api/movieApi';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await fetchWishlist();
      setWishlist(data);
      setWishlistIds(new Set(data.map((item) => item.movieId)));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isWishlisted = useCallback(
    (movieId) => wishlistIds.has(movieId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (movie) => {
      const movieId = movie.id || movie.movieId;

      if (wishlistIds.has(movieId)) {
        // Optimistic removal
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(movieId);
          return next;
        });
        setWishlist((prev) => prev.filter((m) => m.movieId !== movieId));
        setToastMessage({ type: 'info', text: `Removed "${movie.title}" from wishlist` });

        try {
          await apiRemove(movieId);
        } catch (error) {
          // Revert on failure
          setWishlistIds((prev) => new Set(prev).add(movieId));
          await loadWishlist();
          setToastMessage({ type: 'error', text: 'Failed to remove from wishlist' });
        }
      } else {
        // Optimistic add
        const wishlistItem = {
          movieId: movieId,
          title: movie.title,
          posterPath: movie.posterPath,
          backdropPath: movie.backdropPath,
          voteAverage: movie.voteAverage,
          releaseDate: movie.releaseDate,
          overview: movie.overview,
          genres: movie.genres || [],
        };

        setWishlistIds((prev) => new Set(prev).add(movieId));
        setWishlist((prev) => [wishlistItem, ...prev]);
        setToastMessage({ type: 'success', text: `Added "${movie.title}" to wishlist` });

        try {
          await apiAdd(wishlistItem);
        } catch (error) {
          // Revert on failure
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(movieId);
            return next;
          });
          setWishlist((prev) => prev.filter((m) => m.movieId !== movieId));
          setToastMessage({ type: 'error', text: 'Failed to add to wishlist' });
        }
      }
    },
    [wishlistIds]
  );

  const clearToast = useCallback(() => setToastMessage(null), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlistIds.size,
        loading,
        isWishlisted,
        toggleWishlist,
        toastMessage,
        clearToast,
        refreshWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
