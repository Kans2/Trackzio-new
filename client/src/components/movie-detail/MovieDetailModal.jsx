import { useState, useEffect, useCallback } from 'react';
import { fetchMovieDetails } from '../../api/movieApi';
import { useWishlist } from '../../context/WishlistContext';
import { PLACEHOLDER_BACKDROP, PLACEHOLDER_POSTER, getRatingColor, formatDate } from '../../utils/constants';
import MovieCard from '../movies/MovieCard';
import Skeleton from '../ui/Skeleton';
import './MovieDetailModal.css';

const MovieDetailModal = ({ movieId, onClose, onMovieClick }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const loadMovie = useCallback(async () => {
    if (!movieId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovieDetails(movieId);
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadMovie();
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loadMovie]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleSimilarClick = (id) => {
    onMovieClick?.(id);
  };

  const wishlisted = movie ? isWishlisted(movie.id) : false;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true">
        {/* Close button */}
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {loading && <Skeleton variant="detail" />}

        {error && (
          <div className="modal__error">
            <p>{error}</p>
            <button onClick={loadMovie}>Retry</button>
          </div>
        )}

        {movie && !loading && (
          <>
            {/* Backdrop / Trailer */}
            <div className="modal__hero">
              {showTrailer && movie.trailer ? (
                <div className="modal__trailer">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1&rel=0`}
                    title={`${movie.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="modal__backdrop-img">
                  <img
                    src={movie.backdropPath || PLACEHOLDER_BACKDROP}
                    alt={movie.title}
                  />
                  <div className="modal__backdrop-gradient" />
                </div>
              )}

              <div className="modal__hero-actions">
                {movie.trailer && (
                  <button
                    className="modal__play-btn"
                    onClick={() => setShowTrailer(!showTrailer)}
                  >
                    {showTrailer ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Close Trailer
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Play Trailer
                      </>
                    )}
                  </button>
                )}
                <button
                  className={`modal__wishlist-btn ${wishlisted ? 'modal__wishlist-btn--active' : ''}`}
                  onClick={() => toggleWishlist(movie)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishlisted ? 'In My List' : 'Add to List'}
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="modal__body">
              <div className="modal__main">
                <div className="modal__top-info">
                  {movie.voteAverage > 0 && (
                    <span className="modal__rating-badge" style={{ color: getRatingColor(movie.voteAverage) }}>
                      ★ {movie.voteAverage}
                    </span>
                  )}
                  {movie.year && <span className="modal__year">{movie.year}</span>}
                  {movie.runtimeFormatted && <span className="modal__runtime">{movie.runtimeFormatted}</span>}
                </div>

                <h2 className="modal__title">{movie.title}</h2>

                {movie.tagline && (
                  <p className="modal__tagline">"{movie.tagline}"</p>
                )}

                {movie.genres && movie.genres.length > 0 && (
                  <div className="modal__genre-tags">
                    {movie.genres.map((genre, i) => (
                      <span key={i} className="modal__genre-tag">{genre}</span>
                    ))}
                  </div>
                )}

                <p className="modal__overview">{movie.overview}</p>

                {/* Crew */}
                {movie.crew && (
                  <div className="modal__crew">
                    {movie.crew.directors?.length > 0 && (
                      <div className="modal__crew-item">
                        <span className="modal__crew-label">Director</span>
                        <span className="modal__crew-value">
                          {movie.crew.directors.map((d) => d.name).join(', ')}
                        </span>
                      </div>
                    )}
                    {movie.crew.writers?.length > 0 && (
                      <div className="modal__crew-item">
                        <span className="modal__crew-label">Writers</span>
                        <span className="modal__crew-value">
                          {movie.crew.writers.map((w) => w.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional details */}
                <div className="modal__details-grid">
                  {movie.releaseDate && (
                    <div className="modal__detail-item">
                      <span className="modal__detail-label">Release Date</span>
                      <span className="modal__detail-value">{formatDate(movie.releaseDate)}</span>
                    </div>
                  )}
                  {movie.status && (
                    <div className="modal__detail-item">
                      <span className="modal__detail-label">Status</span>
                      <span className="modal__detail-value">{movie.status}</span>
                    </div>
                  )}
                  {movie.originalLanguage && (
                    <div className="modal__detail-item">
                      <span className="modal__detail-label">Language</span>
                      <span className="modal__detail-value">{movie.originalLanguage.toUpperCase()}</span>
                    </div>
                  )}
                  {movie.voteCount > 0 && (
                    <div className="modal__detail-item">
                      <span className="modal__detail-label">Votes</span>
                      <span className="modal__detail-value">{movie.voteCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="modal__cast-section">
                  <h3 className="modal__section-title">Cast</h3>
                  <div className="modal__cast-scroll">
                    {movie.cast.map((person) => (
                      <div key={person.id} className="modal__cast-card">
                        <div className="modal__cast-img-wrapper">
                          {person.profilePath ? (
                            <img src={person.profilePath} alt={person.name} loading="lazy" />
                          ) : (
                            <div className="modal__cast-placeholder">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="modal__cast-name">{person.name}</p>
                        <p className="modal__cast-character">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Movies */}
              {movie.similar && movie.similar.length > 0 && (
                <div className="modal__similar-section">
                  <h3 className="modal__section-title">More Like This</h3>
                  <div className="modal__similar-grid">
                    {movie.similar.slice(0, 8).map((sim) => (
                      <MovieCard
                        key={sim.id}
                        movie={sim}
                        onClick={handleSimilarClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal;
