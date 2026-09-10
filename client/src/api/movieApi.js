import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — unwrap { success, data } pattern
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    
    const customError = new Error(message);
    customError.status = error.response?.status || 500;
    return Promise.reject(customError);
  }
);

// ==================== MOVIES ====================

export const fetchTrending = async (page = 1) => {
  const res = await api.get('/movies/trending', { params: { page } });
  return res.data;
};

export const searchMovies = async (query, page = 1) => {
  const res = await api.get('/movies/search', { params: { query, page } });
  return res.data;
};

export const fetchMovieDetails = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};

export const fetchGenres = async () => {
  const res = await api.get('/movies/genres');
  return res.data;
};

export const discoverMovies = async (genre, page = 1, sortBy = 'popularity.desc') => {
  const res = await api.get('/movies/discover', {
    params: { genre, page, sort_by: sortBy },
  });
  return res.data;
};

export const fetchTopRated = async (page = 1) => {
  const res = await api.get('/movies/top-rated', { params: { page } });
  return res.data;
};

export const fetchUpcoming = async (page = 1) => {
  const res = await api.get('/movies/upcoming', { params: { page } });
  return res.data;
};

export const fetchNowPlaying = async (page = 1) => {
  const res = await api.get('/movies/now-playing', { params: { page } });
  return res.data;
};

// ==================== WISHLIST ====================

export const fetchWishlist = async () => {
  const res = await api.get('/wishlist');
  return res.data;
};

export const addToWishlist = async (movie) => {
  const res = await api.post('/wishlist', movie);
  return res.data;
};

export const removeFromWishlist = async (movieId) => {
  const res = await api.delete(`/wishlist/${movieId}`);
  return res;
};

export const checkWishlist = async (movieId) => {
  const res = await api.get(`/wishlist/check/${movieId}`);
  return res.data;
};

export const batchCheckWishlist = async (ids) => {
  const res = await api.get('/wishlist/batch-check', {
    params: { ids: ids.join(',') },
  });
  return res.data;
};

export default api;
