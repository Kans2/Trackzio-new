import { useState, useEffect } from 'react';
import { fetchTrending, fetchTopRated, fetchUpcoming, fetchNowPlaying } from '../api/movieApi';
import MovieHero from '../components/movies/MovieHero';
import MovieRow from '../components/movies/MovieRow';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import './HomePage.css';

const HomePage = ({ onMovieClick }) => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trendingData, topRatedData, upcomingData, nowPlayingData] = await Promise.allSettled([
        fetchTrending(1),
        fetchTopRated(1),
        fetchUpcoming(1),
        fetchNowPlaying(1),
      ]);

      if (trendingData.status === 'fulfilled') setTrending(trendingData.value.results);
      if (topRatedData.status === 'fulfilled') setTopRated(topRatedData.value.results);
      if (upcomingData.status === 'fulfilled') setUpcoming(upcomingData.value.results);
      if (nowPlayingData.status === 'fulfilled') setNowPlaying(nowPlayingData.value.results);

      // If all failed, show error
      const allFailed = [trendingData, topRatedData, upcomingData, nowPlayingData]
        .every((r) => r.status === 'rejected');
      if (allFailed) {
        setError('Failed to load movies. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (error && trending.length === 0) {
    return <ErrorState message={error} onRetry={loadData} fullPage />;
  }

  return (
    <div className="home-page">
      {loading ? (
        <Skeleton variant="hero" />
      ) : (
        <MovieHero movies={trending} onMovieClick={onMovieClick} />
      )}

      <div className="home-page__content">
        <MovieRow
          title="🔥 Trending This Week"
          movies={trending}
          onMovieClick={onMovieClick}
          loading={loading}
        />

        <MovieRow
          title="🎬 Now Playing"
          movies={nowPlaying}
          onMovieClick={onMovieClick}
          loading={loading}
        />

        <MovieRow
          title="⭐ Top Rated"
          movies={topRated}
          onMovieClick={onMovieClick}
          loading={loading}
        />

        <MovieRow
          title="🎥 Upcoming"
          movies={upcoming}
          onMovieClick={onMovieClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default HomePage;
