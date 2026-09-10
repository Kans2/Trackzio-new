import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies, onMovieClick, loading = false }) => {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const row = rowRef.current;
    if (row) {
      row.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (row) row.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [movies]);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="movie-row">
        <div className="movie-row__header">
          <div className="skeleton" style={{ width: '200px', height: '28px' }} />
        </div>
        <div className="movie-row__scroll">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="movie-row__skeleton-card skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      <div className="movie-row__header">
        <h2 className="movie-row__title">{title}</h2>
      </div>

      <div className="movie-row__container">
        {canScrollLeft && (
          <button className="movie-row__arrow movie-row__arrow--left" onClick={() => scroll('left')} aria-label="Scroll left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div className="movie-row__scroll" ref={rowRef}>
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id || index}
              movie={movie}
              onClick={onMovieClick}
              animationDelay={index * 50}
            />
          ))}
        </div>

        {canScrollRight && (
          <button className="movie-row__arrow movie-row__arrow--right" onClick={() => scroll('right')} aria-label="Scroll right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
