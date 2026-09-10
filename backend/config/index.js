const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/movie-discovery',
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    accessToken: process.env.TMDB_ACCESS_TOKEN,
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
};
