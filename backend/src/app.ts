import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import subscriptionRoutes from './routes/subscription.routes';
import scoreRoutes from './routes/score.routes';
import drawRoutes from './routes/draw.routes';
import charityRoutes from './routes/charity.routes';
import adminRoutes from './routes/admin.routes';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { sanitizeRequest } from './middleware/sanitize.middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '');
const allowedOrigins = new Set(env.ALLOWED_ORIGINS.map(normalizeOrigin));

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, Postman) and configured browser origins.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      // Return CORS-denied without throwing a server error.
      callback(null, false);
    }
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);
app.use(sanitizeRequest);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draw', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
