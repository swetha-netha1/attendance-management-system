const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', attendanceRoutes); // ✅ Attach attendance routes properly

// Error handling middleware (should come last)
app.use(errorHandler);

module.exports = app;
