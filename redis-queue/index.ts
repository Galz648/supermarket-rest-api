import { RedisService, MessageTopic } from './redis.service';
import RedisProducer from './producer';
import RedisConsumer from './consumer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== Starting Redis Message Queue Service ===');
console.log(`Available topics: ${Object.values(MessageTopic).join(', ')}`);
console.log('Environment variables:');
console.log(`- REDIS_HOST: ${process.env.REDIS_HOST || 'localhost'}`);
console.log(`- REDIS_PORT: ${process.env.REDIS_PORT || '6379'}`);
console.log(`- API_BASE_URL: ${process.env.API_BASE_URL || 'http://localhost:3000'}`);
console.log(`- POLL_INTERVAL: ${process.env.POLL_INTERVAL || '1000'}`);
console.log(`- PUBLISH_TEST_MESSAGES: ${process.env.PUBLISH_TEST_MESSAGES || 'false'}`);

// Configuration
const config = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    },
    consumer: {
        pollInterval: parseInt(process.env.POLL_INTERVAL || '1000'),
    },
    topics: Object.values(MessageTopic),
};

// Create Redis service
console.log(`Creating Redis service with host: ${config.redis.host}, port: ${config.redis.port}`);
const redisService = new RedisService(config.redis.host, config.redis.port);

// Create Redis consumer and producer
console.log('Creating Redis consumer and producer');
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

// Function to send a test item creation message
const sendTestItemCreationMessage = async () => {
    console.log('Sending test item creation message...');
    const testItemData = {
        createTestItem: true,
        itemName: `Test Item ${new Date().toISOString()}`,
        brand: 'Test Brand',
        category: 'Test Category',
        description: 'This is a test item created via Redis message queue',
        barcode: `TEST${Math.floor(Math.random() * 1000000)}`,
        price: (Math.random() * 100).toFixed(2),
    };

    try {
        const messageId = await redisProducer.publishMessage(MessageTopic.PRODUCT_UPDATES, testItemData);
        if (messageId) {
            console.log(`Test item creation message sent with ID: ${messageId}`);
        } else {
            console.error('Failed to send test item creation message');
        }
    } catch (error) {
        console.error('Error sending test item creation message:', error);
    }
};

// Start the consumer and producer independently
const startConsumer = async () => {
    try {
        console.log('Starting consumer...');
        await redisConsumer.start();
        console.log('Consumer is running and waiting for messages...');
    } catch (error) {
        console.error('Failed to start consumer:', error);
    }
};

const startProducer = async () => {
    console.log('Preparing to start producer...');
    // Wait for Redis connection before starting producer
    const checkConnection = setInterval(() => {
        if (redisService.isConnected()) {
            clearInterval(checkConnection);
            console.log('Redis connected, starting producer...');

            // Start the producer to send regular messages
            console.log('Starting regular message producer...');
            redisProducer.start();

        }
    })
}

// Start both components
console.log('Starting both consumer and producer...');
Promise.all([startConsumer(), startProducer()])
    .then(() => {
        console.log('Both consumer and producer started successfully');
    })
    .catch(error => {
        console.error('Error starting services:', error);
    });
