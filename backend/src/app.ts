import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';

const app = express();

// Configure CORS to support both client-side portals
const allowedOrigins = [
  'http://localhost:5173', // Frontend local port
  'http://localhost:5174', // Admin dashboard local port
  'http://localhost:5175', // Admin dashboard fallback local port
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // Permit specified origins, and fall back to open CORS in non-prod environments
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Master routes mapping
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
