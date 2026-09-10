import MovieCard from './MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ movies, onMovieClick, loading = false, columns }) => {
  if (loading && (!movies || movies.length === 0)) {
    return (
      <div className="movie-grid" style={columns ? { '--grid-columns': columns } : undefined}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="movie-grid__skeleton">
            <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 'var(--radius-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '14px', marginTop: '10px' }} />
            <div className="skeleton" style={{ width: '50%', height: '12px', marginTop: '6px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="movie-grid" style={columns ? { '--grid-columns': columns } : undefined}>
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id || movie.movieId || index}
          movie={movie}
          onClick={onMovieClick}
          animationDelay={index * 30}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
