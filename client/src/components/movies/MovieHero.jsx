import { useState, useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { PLACEHOLDER_BACKDROP } from '../../utils/constants';
import './MovieHero.css';

const MovieHero = ({ movies, onMovieClick, onPlayTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const movie = movies?.[currentIndex];

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
      setImageLoaded(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movie) return null;

  const wishlisted = isWishlisted(movie.id);
  const backdropSrc = movie.backdropPath || PLACEHOLDER_BACKDROP;

  return (
    <section className="hero">
      <div className="hero__backdrop-wrapper">
        <img
          src={backdropSrc}
          alt={movie.title}
          className={`hero__backdrop ${imageLoaded ? 'hero__backdrop--loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="hero__gradient-left" />
        <div className="hero__gradient-bottom" />
      </div>

      <div className="hero__content">
        <div className="hero__content-inner">
          {movie.genres && movie.genres.length > 0 && (
            <div className="hero__genres">
              {movie.genres.slice(0, 3).map((genre, i) => (
                <span key={i} className="hero__genre">{genre}</span>
              ))}
            </div>
          )}

          <h1 className="hero__title">{movie.title}</h1>

          <div className="hero__meta">
            {movie.year && <span className="hero__year">{movie.year}</span>}
            {movie.voteAverage > 0 && (
              <span className="hero__rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--warning)" stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.voteAverage}
              </span>
            )}
          </div>

          <p className="hero__overview">{movie.overview}</p>

          <div className="hero__actions">
            <button className="hero__btn hero__btn--primary" onClick={() => onMovieClick?.(movie.id)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <circle cx="12" cy="8" r="0.5" fill="currentColor" />
              </svg>
              More Info
            </button>
            <button
              className={`hero__btn hero__btn--secondary ${wishlisted ? 'hero__btn--wishlisted' : ''}`}
              onClick={() => toggleWishlist(movie)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlisted ? 'In My List' : 'Add to List'}
            </button>
          </div>
        </div>

        {/* Hero pagination dots */}
        {movies && movies.length > 1 && (
          <div className="hero__dots">
            {movies.slice(0, 5).map((_, i) => (
              <button
                key={i}
                className={`hero__dot ${i === currentIndex ? 'hero__dot--active' : ''}`}
                onClick={() => { setCurrentIndex(i); setImageLoaded(false); }}
                aria-label={`Show movie ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieHero;
