require('./config/dotenv');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/modules/auth/auth.routes');
const caseRoutes = require('./src/modules/case/case.routes');
const stationRoutes = require('./src/modules/station/station.routes');
const officerRoutes = require('./src/modules/officer/officer.routes');
const criminalRoutes = require('./src/modules/criminal/criminal.routes');
const victimRoutes = require('./src/modules/victim/victim.routes');
const arrestRoutes = require('./src/modules/arrest/arrest.routes');
const firRoutes = require('./src/modules/fir/fir.routes');
const evidenceRoutes = require('./src/modules/evidence/evidence.routes');
const dashboardRoutes = require('./src/modules/dashboard/dashboard.routes');

const { errorHandler, notFound } = require('./src/shared/middleware/error.middleware');
const { authorizeRoles, verifyToken } = require('./src/shared/middleware/auth.middleware');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map((o) => o.trim()) : []),
];

app.use(cors({
  origin: allowedOrigins,
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

// Apply token verification to all routes below this point
app.use('/api', verifyToken);

// The old /api/officer handled everything. Now we map to individual modules.
// But wait, the frontend currently expects /api/officer/cases etc.
// Let's preserve the existing API shape for the frontend for now under /api/officer/
const legacyRouter = express.Router();
legacyRouter.use('/dashboard', dashboardRoutes); // Was getAllData in officerController
legacyRouter.use('/cases', caseRoutes);
legacyRouter.use('/stations', stationRoutes);
legacyRouter.use('/officers', officerRoutes);
legacyRouter.use('/criminals', criminalRoutes);
legacyRouter.use('/victims', victimRoutes);
legacyRouter.use('/arrests', arrestRoutes);
legacyRouter.use('/firs', firRoutes);
legacyRouter.use('/evidence', evidenceRoutes);

// The frontend calls /api/officer for all these currently.
// And it expects to hit endpoints like /api/officer/cases
// BUT the original officer controller also had separate files for victim/criminal in /api/victim and /api/criminal. Wait, let me check the frontend routes.
app.use('/api/officer', authorizeRoles(['officer', 'chief']), legacyRouter);

// Some standalone routes from old app.js
app.use('/api/victim', authorizeRoles(['victim']), victimRoutes);
app.use('/api/criminal', authorizeRoles(['criminal']), criminalRoutes);

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
