import Redis from 'ioredis'
import { config } from '../config/config.js';

const redis = new Redis({
    host: config.REDIS_HOST || '127.0.0.1',
    port: config.REDIS_PORT || 6379,
    password: config.REDIS_PASSWORD || null,
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000); // Reconnect after 50ms, up to a maximum of 2 seconds
    },
});

redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on('ready', () => {
    console.log('Redis is ready');
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

export const appendMessage = async (key, messageObj) => {
    await redis.lpush(key, JSON.stringify(messageObj));
};

export const getMessages = async (key) => {
    const messages = await redis.lrange(key, 0, -1);
    return messages.map((message) => JSON.parse(message));
};

export default redis;