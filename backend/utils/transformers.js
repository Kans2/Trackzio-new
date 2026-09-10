const config = require('../config');

/**
 * Transform raw TMDB movie data to a consistent app-specific format.
 * Handles missing/incomplete fields gracefully.
 */
const transformMovie = (movie, genreMap = {}) => {
  if (!movie) return null;

  return {
    id: movie.id,
    title: movie.title || movie.original_title || 'Untitled',
    overview: movie.overview || '',
    posterPath: movie.poster_path
      ? `${config.tmdb.imageBaseUrl}/w500${movie.poster_path}`
      : null,
    backdropPath: movie.backdrop_path
      ? `${config.tmdb.imageBaseUrl}/original${movie.backdrop_path}`
      : null,
    voteAverage: movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 0,
    voteCount: movie.vote_count || 0,
    releaseDate: movie.release_date || '',
    year: movie.release_date ? movie.release_date.split('-')[0] : '',
    popularity: movie.popularity || 0,
    originalLanguage: movie.original_language || '',
    genreIds: movie.genre_ids || [],
    genres: movie.genres
      ? movie.genres.map((g) => g.name)
      : (movie.genre_ids || []).map((id) => genreMap[id] || '').filter(Boolean),
    adult: movie.adult || false,
  };
};

/**
 * Transform detailed movie data (includes credits, videos, etc.)
 */
const transformMovieDetails = (movie) => {
  if (!movie) return null;

  const base = transformMovie(movie);

  return {
    ...base,
    tagline: movie.tagline || '',
    runtime: movie.runtime || 0,
    runtimeFormatted: movie.runtime
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : '',
    budget: movie.budget || 0,
    revenue: movie.revenue || 0,
    status: movie.status || '',
    homepage: movie.homepage || '',
    imdbId: movie.imdb_id || '',
    productionCompanies: (movie.production_companies || []).map((c) => ({
      id: c.id,
      name: c.name,
      logoPath: c.logo_path
        ? `${config.tmdb.imageBaseUrl}/w200${c.logo_path}`
        : null,
    })),
    spokenLanguages: (movie.spoken_languages || []).map((l) => l.english_name || l.name),
    cast: (movie.credits?.cast || []).slice(0, 20).map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character || '',
      profilePath: person.profile_path
        ? `${config.tmdb.imageBaseUrl}/w185${person.profile_path}`
        : null,
      order: person.order,
    })),
    crew: {
      directors: (movie.credits?.crew || [])
        .filter((c) => c.job === 'Director')
        .map((d) => ({ id: d.id, name: d.name })),
      writers: (movie.credits?.crew || [])
        .filter((c) => c.department === 'Writing')
        .slice(0, 5)
        .map((w) => ({ id: w.id, name: w.name, job: w.job })),
    },
    videos: (movie.videos?.results || [])
      .filter((v) => v.site === 'YouTube')
      .map((v) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        type: v.type,
        official: v.official,
      })),
    trailer: (() => {
      const videos = movie.videos?.results || [];
      const officialTrailer = videos.find(
        (v) => v.type === 'Trailer' && v.official && v.site === 'YouTube'
      );
      const anyTrailer = videos.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      );
      const anyTeaser = videos.find(
        (v) => v.type === 'Teaser' && v.site === 'YouTube'
      );
      const selected = officialTrailer || anyTrailer || anyTeaser;
      return selected ? selected.key : null;
    })(),
    similar: (movie.similar?.results || []).slice(0, 12).map(transformMovie),
  };
};

/**
 * Transform paginated response
 */
const transformPaginatedResponse = (data, genreMap = {}) => ({
  page: data.page || 1,
  totalPages: Math.min(data.total_pages || 1, 500), // TMDB caps at 500
  totalResults: data.total_results || 0,
  results: (data.results || []).map((movie) => transformMovie(movie, genreMap)),
});

/**
 * Transform genres list
 */
const transformGenres = (data) =>
  (data.genres || []).map((g) => ({
    id: g.id,
    name: g.name,
  }));

module.exports = {
  transformMovie,
  transformMovieDetails,
  transformPaginatedResponse,
  transformGenres,
};
