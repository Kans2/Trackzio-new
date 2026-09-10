import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/ui/Toast';
import MovieDetailModal from './components/movie-detail/MovieDetailModal';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DiscoverPage from './pages/DiscoverPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  return (
    <WishlistProvider>
      <Router>
        <div className="app">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<HomePage onMovieClick={handleMovieClick} />} />
              <Route path="/search" element={<SearchPage onMovieClick={handleMovieClick} />} />
              <Route path="/discover" element={<DiscoverPage onMovieClick={handleMovieClick} />} />
              <Route path="/wishlist" element={<WishlistPage onMovieClick={handleMovieClick} />} />
            </Routes>
          </main>

          <Footer />

          {/* Movie Detail Modal */}
          {selectedMovieId && (
            <MovieDetailModal
              movieId={selectedMovieId}
              onClose={handleCloseModal}
              onMovieClick={handleMovieClick}
            />
          )}

          {/* Toast Notifications */}
          <Toast />
        </div>
      </Router>
    </WishlistProvider>
  );
}

export default App;
