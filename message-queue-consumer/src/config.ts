import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

export default {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    api: {
        endpoint: process.env.API_ENDPOINT || 'http://localhost:3000',
    },
    consumer: {
        pollInterval: parseInt(process.env.CONSUMER_POLL_INTERVAL || '1000', 10),
    },
    topics: (process.env.TOPICS || 'product-updates,price-changes,inventory-updates').split(','),
}; 
