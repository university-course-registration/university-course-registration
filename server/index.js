const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const exportRoutes = require('./routes/exportRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/profile', profileRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
