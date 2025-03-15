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
    publishTestMessages: true // Force test messages to be published
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

            // Send a test message to the product-updates topic
            console.log('Sending initial test message...');
            redisProducer.publishMessage(MessageTopic.PRODUCT_UPDATES, {
                message: 'Hello, world!',
                timestamp: new Date().toISOString(),
                test: true
            }).then(messageId => {
                if (messageId) {
                    console.log(`Test message sent with ID: ${messageId}`);
                } else {
                    console.error('Failed to send test message');
                }
            }).catch(error => {
                console.error('Error sending test message:', error);
            });

            // Start the producer to send regular messages
            console.log('Starting regular message producer...');
            redisProducer.start();

            // Send additional test messages every 5 seconds
            console.log('Setting up additional test messages every 5 seconds...');
            setInterval(() => {
                console.log('Sending additional test message...');
                redisProducer.publishMessage(MessageTopic.PRODUCT_UPDATES, {
                    message: `Test message at ${new Date().toISOString()}`,
                    timestamp: new Date().toISOString(),
                    test: true
                }).then(messageId => {
                    if (messageId) {
                        console.log(`Additional test message sent with ID: ${messageId}`);
                    }
                }).catch(error => {
                    console.error('Error sending additional test message:', error);
                });
            }, 5000);
        } else {
            console.log('Waiting for Redis connection...');
        }
    }, 1000);
};

// Start both components
console.log('Starting both consumer and producer...');
Promise.all([startConsumer(), startProducer()])
    .then(() => {
        console.log('Both consumer and producer started successfully');
    })
    .catch(error => {
        console.error('Error starting services:', error);
    });
