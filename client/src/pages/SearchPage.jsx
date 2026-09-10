import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/movieApi';
import MovieGrid from '../components/movies/MovieGrid';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { SORT_OPTIONS } from '../utils/constants';
import './SearchPage.css';

const SearchPage = ({ onMovieClick }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');

  const loadMovies = useCallback(async (searchQuery, pageNum, append = false) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await searchMovies(searchQuery, pageNum);
      setMovies((prev) => (append ? [...prev, ...data.results] : data.results));
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset when query changes
  useEffect(() => {
    if (query) {
      setMovies([]);
      setPage(1);
      loadMovies(query, 1);
    }
  }, [query, loadMovies]);

  const loadMore = useCallback(async () => {
    if (page < totalPages && !loading) {
      await loadMovies(query, page + 1, true);
    }
  }, [page, totalPages, loading, query, loadMovies]);

  useInfiniteScroll(loadMore, { hasMore: page < totalPages });

  // Client-side sort (TMDB search doesn't support server-side sort)
  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'vote_average.desc':
        return (b.voteAverage || 0) - (a.voteAverage || 0);
      case 'release_date.desc':
        return (b.releaseDate || '').localeCompare(a.releaseDate || '');
      case 'release_date.asc':
        return (a.releaseDate || '').localeCompare(b.releaseDate || '');
      case 'original_title.asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'popularity.desc':
      default:
        return (b.popularity || 0) - (a.popularity || 0);
    }
  });

  if (!query) {
    return (
      <div className="search-page">
        <div className="search-page__header container">
          <h1 className="search-page__title">Search Movies</h1>
          <p className="search-page__subtitle">Use the search bar above to find movies</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-page__header container">
        <div className="search-page__top">
          <div>
            <h1 className="search-page__title">
              Results for "{query}"
            </h1>
            {totalResults > 0 && (
              <p className="search-page__count">{totalResults.toLocaleString()} movies found</p>
            )}
          </div>

          {movies.length > 0 && (
            <div className="search-page__sort">
              <label htmlFor="sort-select">Sort by</label>
              <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => loadMovies(query, 1)} />}

      {!loading && !error && movies.length === 0 && (
        <EmptyState
          title="No movies found"
          message={`We couldn't find any movies matching "${query}". Try a different search term.`}
        />
      )}

      {sortedMovies.length > 0 && (
        <MovieGrid movies={sortedMovies} onMovieClick={onMovieClick} loading={false} />
      )}

      {loading && (
        <div className="search-page__loading">
          <div className="spinner" />
          <p>Searching...</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
