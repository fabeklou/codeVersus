import express from 'express';
import session from 'express-session';
import authRoutes from './auth/index.js';
import mainRoutes from './routes/index.js';
import checkAuthStatus from './middlewares/checkAuthStatus.js';
import { redisStore } from './config/redis.js';
import db from './config/db.js';

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

app.use(authRoutes);
app.use(checkAuthStatus);
app.use(mainRoutes);

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
