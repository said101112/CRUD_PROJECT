import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS with specific options
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Limit requests from same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body and limit size
app.use(express.json({ limit: '10kb' }));

// Prevent parameter pollution
app.use(hpp());

app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mini Project Management API' });
});

// Port configuration
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
