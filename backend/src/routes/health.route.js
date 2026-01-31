import express from 'express';
import { healthCheck } from '../controllers/health.controller.js';

const router = express.Router();

// Liveness at both "/" and "/ping" for flexibility
router.get('/', healthCheck);
router.get('/ping', healthCheck);

export default router;
