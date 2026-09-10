import { useWishlist } from '../context/WishlistContext';
import MovieGrid from '../components/movies/MovieGrid';
import EmptyState from '../components/ui/EmptyState';
import './WishlistPage.css';

const WishlistPage = ({ onMovieClick }) => {
  const { wishlist, loading } = useWishlist();

  // Transform wishlist items to match MovieCard expected props
  const movies = wishlist.map((item) => ({
    id: item.movieId,
    title: item.title,
    posterPath: item.posterPath,
    backdropPath: item.backdropPath,
    voteAverage: item.voteAverage,
    releaseDate: item.releaseDate,
    overview: item.overview,
    genres: item.genres,
    year: item.releaseDate ? item.releaseDate.split('-')[0] : '',
  }));

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__header container">
        <h1 className="wishlist-page__title">My List</h1>
        <p className="wishlist-page__subtitle">
          {movies.length > 0
            ? `${movies.length} movie${movies.length !== 1 ? 's' : ''} saved`
            : 'Your personal movie collection'}
        </p>
      </div>

      {loading && (
        <MovieGrid movies={[]} loading={true} onMovieClick={onMovieClick} />
      )}

      {!loading && movies.length === 0 && (
        <EmptyState
          title="Your list is empty"
          message="Start adding movies to your list by clicking the ❤️ button on any movie."
          icon={
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
        />
      )}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onMovieClick={onMovieClick} />
      )}
    </div>
  );
};

export default WishlistPage;
