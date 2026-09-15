import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || 'http://localhost:3000' }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'technest-api' }));
app.use('/api/chat', rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many requests. Please wait a minute and try again.' } }), chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

connectDatabase()
  .then(() => app.listen(port, () => console.log(`TechNest API running on http://localhost:${port}`)))
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });

export { app };
