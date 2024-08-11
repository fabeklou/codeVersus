import { createClient } from 'redis';
import RedisStore from 'connect-redis';

const redisClient = await createClient()
  .on('error', (err) => console.log(`Redis client error: ${err}`))
  .connect();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'CodeVersus:',
});

export { redisClient, redisStore };
