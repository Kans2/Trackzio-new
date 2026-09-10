import { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { PLACEHOLDER_POSTER, getRatingColor } from '../../utils/constants';
import './MovieCard.css';

const MovieCard = ({ movie, onClick, style, animationDelay = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = isWishlisted(movie.id || movie.movieId);
  const posterSrc = imageError ? PLACEHOLDER_POSTER : (movie.posterPath || PLACEHOLDER_POSTER);
  const year = movie.year || (movie.releaseDate ? movie.releaseDate.split('-')[0] : '');
  const rating = movie.voteAverage || 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(movie);
  };

  return (
    <div
      className="movie-card"
      onClick={() => onClick?.(movie.id || movie.movieId)}
      style={{ ...style, animationDelay: `${animationDelay}ms` }}
      role="button"
      tabIndex={0}
      aria-label={`${movie.title}${year ? ` (${year})` : ''}`}
    >
      <div className="movie-card__poster-wrapper">
        {!imageLoaded && !imageError && (
          <div className="movie-card__poster-skeleton skeleton" />
        )}
        <img
          src={posterSrc}
          alt={movie.title}
          className={`movie-card__poster ${imageLoaded ? 'movie-card__poster--loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          <div className="movie-card__overlay-content">
            {rating > 0 && (
              <div className="movie-card__rating" style={{ borderColor: getRatingColor(rating) }}>
                <span style={{ color: getRatingColor(rating) }}>★</span>
                {rating}
              </div>
            )}
            <h3 className="movie-card__title-overlay">{movie.title}</h3>
            {year && <p className="movie-card__year">{year}</p>}
            {movie.genres && movie.genres.length > 0 && (
              <div className="movie-card__genres">
                {movie.genres.slice(0, 2).map((genre, i) => (
                  <span key={i} className="movie-card__genre-tag">{genre}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wishlist button */}
        <button
          className={`movie-card__wishlist ${wishlisted ? 'movie-card__wishlist--active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__meta">
          {year && <span>{year}</span>}
          {rating > 0 && (
            <span className="movie-card__meta-rating">
              <span style={{ color: getRatingColor(rating) }}>★</span> {rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
