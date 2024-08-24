import { redisClient } from '../config/redis.js';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const loginLimiterMiddleware = (req, res, next) => {
  const { usernameOrEmail } = req.body;

  if (!usernameOrEmail) {
    return res.status(400)
      .json({ message: 'Username or email is required.' });
  }

  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware-login',
    points: 3, /* 3 requests */
    duration: 900, /* per 15 mins by usernameOrEmail */
    useRedisPackage: true,
  }).consume(usernameOrEmail)
    .then(() => {
      next();
    })
    .catch(() => {
      return res
        .status(429)
        .json({
          message: 'Too many failed login attempts. wait 15 minutes and try again.'
        });
    });
};

const codeExecLimiterMiddleware = (req, res, next) => {
  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware-code-exec',
    points: 2, /* 2 requests */
    duration: 10, /* per 10 seconds by IP */
    useRedisPackage: true,
  }).consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      return res
        .status(429)
        .json({
          message: 'You have attempted to run code too soon. Please try again in a few seconds.'
        });
    });
};

const passwordResetLimiterMiddleware = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400)
      .json({ message: 'Email is required.' });
  }

  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware-password-reset',
    points: 1, /* 1 request */
    duration: 604800, /* per 7 days by email-address */
    useRedisPackage: true,
  }).consume(email)
    .then(() => {
      next();
    })
    .catch(() => {
      return res
        .status(429)
        .json({
          message: 'You must wait 7 days from your last password reset.'
        });
    });
};

const globalLimiterMiddleware = (req, res, next) => {
  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware-global',
    points: 2, /* 2 requests */
    duration: 1, /* per 1 sec by IP */
    useRedisPackage: true,
  }).consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      return res
        .status(429)
        .json({
          message: 'Too many requests.'
        });
    });
};

export {
  loginLimiterMiddleware,
  codeExecLimiterMiddleware,
  passwordResetLimiterMiddleware,
  globalLimiterMiddleware
};
