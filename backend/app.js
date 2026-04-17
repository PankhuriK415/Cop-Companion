const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/authRoutes');
const officerRoutes = require('./routes/officerRoutes');
const victimRoutes  = require('./routes/victimRoutes');
const criminalRoutes = require('./routes/criminalRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// ─── GLOBAL MIDDLEWARE ────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Crime Record Management System is running.' });
});

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/victim', victimRoutes);
app.use('/api/criminal', criminalRoutes);

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
