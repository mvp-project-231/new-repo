import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRouter from './routes/health.route.js';
import authRoutes from "./routes/auth.routes.js";
import { errorHandler, notFoundHandler, requestLogger } from './middleware/error.middleware.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);

// Routes
app.use('/', healthRouter);
app.use("/auth", authRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;