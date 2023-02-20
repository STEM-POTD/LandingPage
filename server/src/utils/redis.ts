import { createClient } from "redis";
import { env } from "./default";

const redisUrl = env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });
    redisClient.on('error', (err) => {
        console.log('Error connecting to Redis', err);
    });

    await redisClient.connect();

    redisClient.set('tRPC', 'Welcome to TRPC')
}

connectRedis();

export default redisClient;