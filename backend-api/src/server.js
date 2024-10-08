import express from 'express';
import session from 'express-session';
import authRoutes from './auth/index.js';
import mainRoutes from './routes/index.js';
import checkAuthStatus from './middlewares/checkAuthStatus.js';
import { redisStore } from './config/redis.js';
import db from './config/db.js';
import apiDoc from './swagger/swaggerSetup.js';
import { globalLimiterMiddleware } from './middlewares/rateLimiterRedis.js';

const app = express();
const port = process.env.EXPRESS_PORT || 5050;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    /** cookies ttl: 3 Days */
    maxAge: 60000 * 60 * 72,
  },
  store: redisStore,
}));

app.use(apiDoc);

app.use(globalLimiterMiddleware);
app.use(authRoutes);
app.use(checkAuthStatus);
app.use(mainRoutes);

/** Fallback route: Not implemented -> http 501 status code */
app.use('*', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
