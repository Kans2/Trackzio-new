import { useState, useEffect, useCallback } from 'react';
import { fetchGenres, discoverMovies, fetchTrending } from '../api/movieApi';
import GenreChips from '../components/movies/GenreChips';
import MovieGrid from '../components/movies/MovieGrid';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { SORT_OPTIONS } from '../utils/constants';
import './DiscoverPage.css';

const DiscoverPage = ({ onMovieClick }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    loadGenres();
  }, []);

  const loadMovies = useCallback(async (genreId, sort, pageNum, append = false) => {
    try {
      setLoading(true);
      setError(null);
      // Always use discover API so sorting works (fetchTrending ignores sort)
      const data = await discoverMovies(genreId, pageNum, sort);
      setMovies((prev) => (append ? [...prev, ...data.results] : data.results));
      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload when genre or sort changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    loadMovies(selectedGenre, sortBy, 1);
  }, [selectedGenre, sortBy, loadMovies]);

  const loadMore = useCallback(async () => {
    if (page < totalPages && !loading) {
      await loadMovies(selectedGenre, sortBy, page + 1, true);
    }
  }, [page, totalPages, loading, selectedGenre, sortBy, loadMovies]);

  useInfiniteScroll(loadMore, { hasMore: page < totalPages });

  const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name || 'All Movies';

  return (
    <div className="discover-page">
      <div className="discover-page__header container">
        <div className="discover-page__top">
          <div>
            <h1 className="discover-page__title">Discover</h1>
            <p className="discover-page__subtitle">Browse movies by genre</p>
          </div>

          <div className="discover-page__sort">
            <label htmlFor="discover-sort">Sort by</label>
            <select id="discover-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {genres.length > 0 && (
        <GenreChips
          genres={genres}
          selectedGenre={selectedGenre}
          onSelect={(id) => setSelectedGenre(id)}
        />
      )}

      {error && <ErrorState message={error} onRetry={() => loadMovies(selectedGenre, sortBy, 1)} />}

      {!loading && !error && movies.length === 0 && (
        <EmptyState
          title="No movies found"
          message="Try selecting a different genre."
        />
      )}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onMovieClick={onMovieClick} loading={false} />
      )}

      {loading && movies.length > 0 && (
        <div className="discover-page__loading">
          <div className="spinner" />
          <p>Loading more...</p>
        </div>
      )}

      {loading && movies.length === 0 && (
        <MovieGrid movies={[]} loading={true} onMovieClick={onMovieClick} />
      )}
    </div>
  );
};

export default DiscoverPage;
