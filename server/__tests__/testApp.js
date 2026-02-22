const express = require('express');
const authRoutes = require('../routes/authRoutes');
const courseRoutes = require('../routes/courseRoutes');
const adminRoutes = require('../routes/adminRoutes');
const errorHandler = require('../middleware/errorHandler');

// Create Express app for testing
function createTestApp() {
  const app = express();

  // Middleware
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/admin', adminRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
}

module.exports = createTestApp;
