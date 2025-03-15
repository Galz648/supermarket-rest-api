import { RedisService, MessageTopic } from './redis.service';
import RedisProducer from './producer';
import RedisConsumer from './consumer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Starting Redis Message Queue Service...');
console.log(`Available topics: ${Object.values(MessageTopic).join(', ')}`);

// Configuration
const config = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    consumer: {
        pollInterval: parseInt(process.env.POLL_INTERVAL || '1000'),
    },
    topics: Object.values(MessageTopic),
    publishTestMessages: process.env.PUBLISH_TEST_MESSAGES === 'true'
};

// Create Redis service
const redisService = new RedisService(config.redis.host, config.redis.port);
// Create Redis consumer and producer
const redisConsumer = new RedisConsumer(redisService);
const redisProducer = new RedisProducer(redisService);

// Process shutdown gracefully
const handleShutdown = () => {
    console.log('Shutting down...');
    redisProducer.stop();
    redisConsumer.stop();
    redisService.disconnect();
    process.exit(0);
};

// Handle process termination
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start the Redis consumer
redisConsumer.start().then(() => {
    console.log('Consumer is running and waiting for messages...');

    // Wait for Redis connection before sending test message
    const checkConnection = setInterval(() => {
        if (redisService.isConnected()) {
            clearInterval(checkConnection);
            console.log('Redis connected, sending test message...');

            // Send a test message to the product-updates topic
            redisProducer.publishMessage(MessageTopic.PRODUCT_UPDATES, {
                message: 'Hello, world!'
            }).then(messageId => {
                if (messageId) {
                    console.log(`Test message sent with ID: ${messageId}`);
                } else {
                    console.error('Failed to send test message');
                }
            });

            // Start the producer to send regular messages
            redisProducer.start();
        }
    }, 1000);
});
