const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security headers
app.use(helmet());

// CORS — allow client dev server
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Body parsing
app.use(express.json());

// Rate limiting
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Movie Discovery API is running' });
});

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📡 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
