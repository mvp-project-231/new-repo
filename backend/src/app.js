import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRouter from './routes/health.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', healthRouter);

export default app;